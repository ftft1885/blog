title:Haproxy使用介绍
date:21:27 2013/4/10

今天开始要写测试框架了。但是因为还不会写公司产品的配置文件。只好拿其他软件来做测试。

haproxy是一个非常mini的负载均衡软件。又小又方便，配置文件也简单明了。

haproxy是一款纯粹的负载均衡软件，nginx也可以负载均衡，但是nginx主要是一个http服务器。

haproxy提供4-7层网络协议，但是主要用到的还是模式tcp和http

安装haproxy
-------------
1. 下载源码

 >http://haproxy.1wt.eu/  #这货怎么都看起来不像官网。像那种免费的二级小站。

 >直接wget http://haproxy.1wt.eu/download/1.4/src/haproxy-1.4.23.tar.gz

2. make

 >make TARGET=linux26 #我觉得一切需要参数的make都是耍流氓。幸好只需要一个就行了。大部分都是linux26+吧。

3. make install

使用
-------
使用我只会一种`./haproxy -f myconf`

-f 加 文件名 就是根据此配置文件启动haproxy

haproxy显然完全靠这个haproxy。不过我貌似在doc中没看到怎么写配置文件，也没看到醒目的example

配置文件
---------

	global
		daemon
	
	listen vs
	    mode http
	    bind localhost:80
	    balance roundrobin
	    server server1 localhost:81
	    server server2 localhost:82
	    server server3 localhost:83
	    server server4 localhost:84

global配置暂时只用到daemon，就是后台运行。

后面的比较重要

我在本机上做实验，用端口来模拟server。

listen后面的vs是随便取的名字，如果不给这个监听事件取名，他就会报错，说缺少id。不过名字实在是毫无意义

server后面那些serverx同理，无意义

bind是指绑定哪个端口，话说bind还能绑定别人的ip吗？不懂

balance就是负载均衡的算法。roundrobin是最简单的一种，按顺序分发。

测试框架
----------
测试框架我不知道是啥，但是师兄说就拿一个软件当成中间的黑盒，自己写server和client跑就行了。

nodejs的最简单的测试server

	var http = require('http');	
	var ports = [81,82,83,84];
	
	ports.forEach(function(port) {
	  http.createServer(function(req,res) {
	    res.end(port+'');
	  }).listen(port);
	});

最简单的测试client

	var http = require('http');
	var max = 100;	
	var opt = {
	  hostname: 'localhost'
	}
	
	for(var i = 0; i < max; i++) {
	  var req = http.request(opt, function(res) {
	    var result = "";
	    res.on('data', function(data) {
	      result += data;
	    });
	    res.on('end', function() {
	      console.log(result);
	    })
	  });
	  req.end();
	}

服务器返回的是自己的端口号，实际测试中返回一个独有id就行了。

client就是不停的发请求。获得是100个数字，数一下四个端口的数字是否差不多就知道roundrobin有没有起作用

总之haproxy确实方便又简单，不过用nodejs的http模块写一个这种东西也很简单吧。。






