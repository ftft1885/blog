title:jsonp完全指南
date:14:04 2013/6/10

此次不说初探啥的,因为jsonp一旦弄懂了就很简单.说完全是因为这次不仅将前端使用jsonp,也讲后台如何定义jsonp api.

ajax是伟大的,也是javascript崛起的原因.也是网页动态的重要因素.

ajax的缺点只有一个: 不能跨域

> 什么是跨域?一句话解释,不能用相对路径访问的url都是跨域.

>> 1. www.baidu.com/path1

>> 2. www.baidu.com:81/path1

>> 3. https://www.baidu.com/path1

>> 4. http://www.baidu.com:80/path1/path2

>> 5. http://baidu.com/path1

> 能和url-1访问ajax的只有url-4,因为4能通过'../'这个相对路径变成url-1.其他要么是协议不同,要么是端口不同,要么是域名不同.

不能跨域是一个很可怕的问题,我们不能自由的跨服务器使用api.于是jsonp出来了

解决跨域问题的JsonP
=======

全称
---------
JsonP = JSON With Padding (说实话我看了全称也不懂)


本质
----------
jsonp不是一个新技术,它本质是`<script src="xxx"></script>`标签

这也是jsonp解决跨域的关键.script的src是可以完美跨域的.

原理
---------
jsonp需要后台服务器支持,就是说服务器必须就是jsonp服务器才能使用jsonp,jsonp服务器返回一个函数,函数名由调用者定义,这个很好理解,因为script就是js嘛.必须是一个可以执行的东西.而不能是一个字符串之类的.

使用方法
----------

	<script src="http://server.example.com/users/abc?callback=whatFuncion"></script>

后台返回

	whatFuncion({"name": "Foo", "id": 1234, "rank": 7});

callback等于什么后台返回的函数就是什么.

jsonp是怎么传递数据的?
--------------
jsonp客户端在请求中将希望定义的函数写在querystring中.比如上例,客户端定义的函数式whatFunction,于是服务器读到querystring中callback的值是whatFuncion,于是返回一个whatFunction的函数执行,执行的中的参数就是传递的值.

可以看出:

- callback是jsonp服务器事先约定的值.

- whatFunction已经在客户端事先定义好了,否则的话肯定报whatFunction没有定义的错误.

后台jsonp 服务器实现
----------------

	http.createServer(function(req, res) {
	    var _url = url.parse(req.url);	
	    var queryStr = _url.query;
	    var queryHash = querystring.parse(queryStr);
	    console.log(queryHash);
	    var _callback = queryHash['callback'];	
	    var output = _callback + '(' + '{a:2, b:1}' + ')';
	    res.end(output);
	}).listen(81);

服务器简单到爆,先通过querystring找出callback对应的值,然后用字符串拼出一个函数执行.

当然服务器是可以返回任意复杂的hash结构的.

	http.createServer(function(req, res) {
	    var _url = url.parse(req.url);	
	    var queryStr = _url.query;
	    var queryHash = querystring.parse(queryStr);	    
	    var _callback = queryHash['callback'];
	    var json = {
	      a: {
	       aa: 'xxx',
	       bb: [1,2,3]
	      },
	      b: 'yyy'
	    } // 一个复杂的数据
	    var output = _callback + '(' + JSON.stringify(json) + ')'; 
	    res.end(output);
	}).listen(81);

使用JSON.stringify把hash数据变成字符串放到括号中间就行了.

前端jsonP函数设计
-------------
前端使用jsonp很简单,但每次都要定义一个全局函数.

我们发现函数是哪个并不重要,因为我们要的执行函数中的参数.

这里学习一下jQuery的做法.jQuery是用`?`代替函数名字,省去开发者定义函数名字的时间.

		function getJsonP(o) {			
			var script = document.createElement('script');
			var src = o.src;
			var index = 1;
			while(window['callback'+index]) {
				index ++;
			}
			src = src.replace('=?', '=callback'+index);
			script.src = src;			
			document.body.appendChild(script);
			window['callback'+index] = o.cb;
		}

调用:

		getJsonP({
			src: 'http://42.121.108.75:81/path?callback=?',
			cb: function(x) {
				console.log(111);
				console.log(x);
			}
		});

直接使用`?`来代表需要返回的函数.在getJsonP函数中,问号被替换成还没被用过的全局函数,我这里用的是callback+递增数字的组合.

函数中的重要一部分是将递增产生的全局函数绑定到cb(cb是callback的缩写)属性上,于是cb函数的参数就是我们需要的参数啦.

jsonp的缺点
----------
由于script是用get获取的,所以jsonp显然也只能全部用get,不能像ajax那样自定义http method.

jsonp占用大量全局变量,每次函数都会污染命名空间.不过有解决方法

	<script src="http://server.example.com/users/abc?callback=mynamespace.whatFuncion"></script>

全扔到一个全局变量中~

写这篇jsonp是为了之后博客全站ajax化,变成全站jsonp.