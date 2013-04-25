keep-alive
=============

保持keep-alive是代理服务器的难点

什么是keep-alive
-----------
keep-alive是http1.1中 Connection的一个option

Connection可选close或者keep-alive

如果不填Connection，则默认为keep-alive

tcp也有keep-alive，但是和http的keep-alive毫无关系

其实在http1.0时代，keep-alive是一个首部

他的值还有参数，比如Keep-alive: max=5, timeout=120

只不过http1.1已经废弃了。1.1如何配置max和timeout，我还不知道。

不keep-alive会怎样
-----
我尝试用nodejs的http模拟connection 关闭。

方法是

	var opt = {
		hostname: 'localhost',
		path: '/',
		method: 'post',
		agent: false	
	}

agent是参数，在http.request中没有connection这个option

我看keep-alive大致的意思是不需要重新建立tcp的三次握手，就是说不释放连接。看有没有释放连接我只会看端口，即：`req.connection.remotePort`

不幸的是端口不管怎么都不会变（是不是释放了有重新建立了个一样端口的tcp连接啊。。），而且每次尝试端口都是像以前那样递增的。可能是我就一个client的缘故，看不出区别，或者我完全理解错了。

keep-alive作用
--------
总之keep-alive就是保持tcp不释放，省去了没发一次包就要重新建立tcp连接的过程，节省不少性能开销


熄灯后看出了区别！
------------
Connection: close的时候(agent: false)

 > 连发100次请求

 > 端口占用从5623=23一次占用到56322（正好100个）
	
	56223
	56224
	56225
	56226
	...
	56319
	56320
	56321
	56322


就是每次tcp都重连了。

Connection: keep-alive

	56340
	56341
	56342
	56343
	56344
	56340
	56341
	56342
	56343
	56344
	56340
	...

也就是说keep-live之后系统不停的复用这5个端口。

为啥是5个？我想这大概是作者自己定义的吧，如果是一个的话，整个请求就成了串行。速度会大有影响。多的话那就成了connection: close啦。还是占一大堆端口。

keep-alive场景
----

keep-alive总结
-----
1. 由上面的实验可以得知，keep-alive并不是不停的用同一个端口。而是重复用几个端口

2. keep-alive对客户端来说，速度反而可能下降。（比如5个端口都pending了，如果不用keep-alive的话就是每个请求一个tcp连接，完全并发）

3. keep-alive对服务端来说省下很多性能开销。减少了握手次数，减少了端口占用。

（proxy）为何难以处理keep-alive
-------------------
先看4层的负载均衡（lvs）

http协议是7层的，所以4层的tcp负载均衡并不认识http的首部Connection: keep-alive

所以net就会盲目转发，也许就跟http不用keep-alive一样。端口逐个递增。

但是服务端是支持keep-alive的。客户端发送keep-alive请求，代理盲目转发，服务端看到keep-alive，也回复keep-alive表示支持keep-alive。

于是客户端兴高采烈像连过的端口发送请求。但是代理觉得很奇怪，我端口都用到56000了，你给我发个55500的请求（打个比方），代理并不认为是刚才的连接（事实上他可能已经关闭了），所以代理直接忽略了这个想不握手就发信息的请求。

而后端真正的服务器以为客户端还要继续发送消息。于是就不释放连接。导致占用资源

所以我猜如果直接用net做代理的话，最明显的bug就是client收不到请求。

下面我们来做实验
-----------
4层代理：

要注意的是代理首先是一个服务器，同时也是个客户端。

客户端写在服务器里面。

用nodejs写4层代理简单至极

	net.createServer(function(c) {
		c.on('data', function(data) {
		
			var client = net.createConnection({port: 80}, function() {
				client.write(data);
			});
			var dd = "";
			client.on('data', function(_d) {
				//console.log(_d+'');
				dd += _d;
			})
			client.on('end', function() {
				c.write(dd);
			})
			
		})
	}).listen(81);

继续启动client疯狂发请求。

1. 关闭keep-alive

 >58088 58089 .... 58107

 >非常正常 就是预期

2. 打开keep-alive

 >...

没错，完全是空白！客户端不停的想不经过握手就连接，而代理却告诉他我不认识keep-alive这个通行证（那是7层上的东西嘛） 

不过我还是有些不解，我觉得客户端至少能收到一个回复吧。总之我还是没真正搞懂

哦，正说着。

	58134
	58135
	58136
	58137
	58138

回复了！大概过了1分钟不到

这才对嘛。跟我想的一模一样，node默认开5个连接，这5个都是经过正式的3次握手。接下来都是无限循环这5个连接，可惜4层代理觉得以前的端口用过了。不认同。所以只有前5个会发过来。

大约又过了1分钟

	58166
	58167
	58168
	58169
	58170

又回复了5个。显然是timeout了。所以客户端只能重新握手（可能代理发现端口不对，就发送rst吧）。可以看出keep-alive其实不会丢失信息。只不过非常慢，如果把timeout的时间改小，还是能快速回复的，当然，这早就不是keep-alive了。

所以说如果要简单的4层代理的话，那就是关闭keep-alive，但是这对代理和服务器都会造成巨大的性能耗费

如何做keep-alive的代理
--------------
要注意的是keepalived这个软件并不是用来做http keep-alive的

keepalived是用来健康检查自动调节的软件

那怎么写支持keep-alive的代理呢。哦 就是直接用http7层代理呀~

完
