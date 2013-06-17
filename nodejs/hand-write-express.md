title:如何手写express
date:12:05 2013/6/17

前言
---------
[express](http://expressjs.com/)我一直无法理解。我只知道这是一个web框架。

但是所有人都用了，上次我说我写网站不用框架啊，别人惊呼：“什么？你裸写？”

我大约知道这可能不是表扬而是嘲讽。这也没办法，我对nodejs本身的api还算熟悉，对express的就搞不懂了。

当然也有另一部分人，他们只会express，不会裸写。没有express，他们不会重定向，不会设置cookie，不会上传文件。对于熟悉http的我，写这个毫无压力。

express的文档其实很难懂，它教我们如何使用api，却没有告诉我们为何要使用。你说如果有人根本不知道`jade,ejs`都不知道，怎么可能看懂`app.engine('jade', require('jade').__express);`这句话是在干什么？

总之我也有很多都看不懂啦。比如中间件的使用，因为我根本不知道什么是`middleware`。我觉得与其花一小时看他的文档，还不如花同样时间动手实现一个原型。

为什么要用express？
--------------
在我看来，express的最大优点在于解耦，不是view，control的解耦，而是路由的解耦。



如果没有express，我们每次都是分析取出req中的pathname，再写出类似`switch(pathname)`这样又长又臭的东西。逻辑混乱。

这时候我自己的解耦方法是传递req和res。

	if (pathname === hello) {
		require(hello)(req,res);
		return
	}

我没有看过别人怎么写，不过我自己就是这么解耦的，防止写成一大块。

express一下子就解决了这个问题。

	app.get('/hello.txt', function(req, res){
	  res.send('Hello World');
	});

这样写随便一眼就知道啥意思。

可是这样不还是写在一起嘛？

我们要记住express的app就是一个对象，可以传递

	main.js
	route_hello(app);

	route_hello.js
	app.get(hello_path1, callback)
	app.get(hello_path2, callback)

我们完全可以把app传递给别的模块，在别的模块继续定义路由。

connect
----------
上述说的功能其实是[connect](https://github.com/senchalabs/connect)的，connect是express的基础

而connect短的令人发指，我在实现的时候大量抄connect的写法。

链式函数
------------
express可以这样写

	app.set(...)
		.use(..)
		.use(..)

jquery可是这样，这是什么呢？

其实这是chainable function

每个子函数都是返回`this`，说出来果然不值一提。。

app究竟是什么？
----------

	var app = express();

这个app就是一个javasccript的对象。

而app本身也是一个函数，因为它放在

	http.createServer(app);

中嘛，我们知道,没有express，它本该这么写。

	http.createServer(function(req, res){})；

所以app就是一个handle样的东西。

那express()是啥呢？可以猜出，express绝对是一个返回函数的函数。闭包！

express的实现简单到让人吐血

	module.exports = createServer;
	
	function createServer() {
	  function app(req, res, next) {
	    app.handle(req, res, next);
	  }
	  app.stack = [];
	  utils.merge(app, proto);
	  return app;
	}

返回函数app，app执行就是执行自己的handle子函数。

utils.merge是啥玩意儿呢。这是connect的写法，说出来更是不值一提

	utils.merge = function(a, b) {
	  if (a && b) {
	    for (var i in b) {
	      a[i] = b[i];
	    }
	  }
	  return a;
	}

其实我们自己都经常这么写，只是没把他写成一个函数而已。。

总之就是把`proto`上的属性也给app啦。类似原型继承。

proto
--------
proto中就定义了app的handle方法，set，get，post等方法

如何实现`app.get(path, callback)`
--------
这是本文重点，由于我根本没看懂next那个函数是什么玩意儿，这里完全由自己实现，不过确实是可以运行了。

先看下app.get
	
	app.get('/', function(req, res) {	
	  res.end('hi');	
	})
	
	app.get('/a', function(req, res) {
	  res.render({hi: 'json'});
	})

get或post的本质是把自己的路由表存入一个数组，然后按次序匹配。

	proto.get = function(p) {
	  var fn = arguments[arguments.length-1];
	  var stack = this.stack;
	  stack.push({
	    pathname: p,
	    method: 'GET',
	    fn: fn
	  });
	}

使用一个叫stack的数组来保存这些路由表。

每次调用get，都会把所有属性包括回调函数push进这个数组中。

### handle是如何用这些路由的？

	proto.handle = function(req, res, next) {
	  var stack = this.stack;
	  var index = 0;
	
	  tryMatch();
	
	  function tryMatch() {	
	    if (index === stack.length) {
	      // nothing
	      res.writeHead(404);
	      res.end("404 not found");
	      return;
	    }
	    var layer = stack[index++];
	
	    if (method === layer.method && pathname == layer.pathname) {
	      layer.fn(req, res, next);
	    } else {
	      tryMatch();
	    }
	  }

	}

我们定义一个叫tryMatch的内部函数，从stack开始尝试匹配，如果path和http method都匹配了，那就调用其回调函数，否则，继续向下一个stack元素匹配。如果一直匹配到没有就返回404.

可以看出这是一个递归调用的过程。

其实这就是分别路由的基本原理了。简单吧。

res多种方法
------------
另一个让我们羡慕的功能是express的res具有多种功能，它可以

	res.render();
	res.send();
	res.json();
	res.redirect();
	res.cookie();

这些真的非常好用，这是怎么实现的呢？

	proto.handle = function(req, res, next) {
	  var stack = this.stack;
	  var index = 0;
	  // 加上这句话
	  utils.merge(res, response);
	
	  var method = req.method;

我们在handle中加上 `utils.merge(res, response);`

response是`response = require('response.js');`来的。

看到这个就明白了，在handle的时候给每个response都加上了各种方法。

随便写一个response的方法：

	response.js:

	response.json = function(json) {
	  this.end(JSON.stringify(json, null, '\t'));
	}

恩！就这么简单。

req同理~

set
--------
express中还可以set

	app.set('title', 'My Site');
	app.set('views', __dirname+'/views'); // 设置view目录

这是怎么实现的呢。

我们可以定义新建一个setting.js的模块，里面只有一句话

	module.exports = {};

需要使用的模块（如.set, .get, res.render）加载`setting.js`即可

尼玛简单的我都不好意思说。

总结
-----
我不知道自己的实现和express实际实现的原理有多大区别，但我确实是理解express的基本原理。你看，实现一个小express就不到30分钟，比起花一小时看文档不知道高哪里去了。