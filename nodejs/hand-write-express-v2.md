title:手写express第二波
date:21:02 2013/6/17

接着上一篇手写express

复杂路由
----------

express中有一个路由选择，可以完成非常复杂的路由匹配。

	app.get('/hello');
	app.get('/user/:id');
	app.get(/*error*/);

就是说大致有三种

1. 直接匹配（也是最简单的那种）

2. 定位符匹配，匹配出预先设置位置的元素。

3. 正则匹配。


其中直接匹配和正则匹配显然都比较容易。而定位符匹配直接把我难爆了。

	var regStr = p.replace(/:\w+/g, "(\\w+)");
	var meta = "[]{}^$|*.?", metaStr = '([';
	for (var i = 0; i < meta.length; i++) {
		metaStr += "\\"+meta[i];
	}
	metaStr += '])';
	
	regStr = regStr.replace(new RegExp(metaStr, 'g'), "\\$1");
	
	var reg = new RegExp(regStr);
	
	var _reg = new RegExp(':\\w+', 'g');
	
	var keys = p.match(_reg);
	
	var result = pathname.match(reg); // result
	
	if (keys.length > 0 && result && result.length > 0) {
		for (var i = 0; i < keys.length; i++) {
		  var k = keys[i].substring(1, keys[i].length);
		  params[k] = result[i+1];
		}
		flag = true;
	}

匹配还是用的正则定位符，不过看起来很丑的呢，最近太喜欢用正则了，唉！

看我的这个就大概猜到为什么connect放弃了路由表的功能，而全部交给express去用了。要真正完成路由表匹配，还要写不少代码。

中间件
----------
connect自己是不是中间件我不知道，但是connect加入其它中间件非常方便，**可以自由使用中间件**是connect的特色功能。

	app.set('static', __dirname + '/static')
	
	app.use(express.static(__dirname+'/static', {
		layout: 'layout.html',
		timeout: 'xxx'
	}));

这是两种调用中间件的方法，乍一看觉得第一种简洁明了，但细细分析发现并不如此。

第一种设置static这个全局设置变量为一个路径，难以加上其他参数，除非把第二个变量变为hash。不过这样明显不好，因为路径是最主要的，static反而不重要，而且很难记住。后台调用static还要专门去取这个值，难以封装成一个专门的模块。

第二种使用中间件，中间件不仅不需要`'static'`这些专属变量，还可以设置各种可选变量。

那这个中间件到底是啥呢？

说到底app.use和app.get以及app.post毫无区别，都是把**回调函数加入运行栈**（也就是那个stack数组！）

来看一下我自己写着玩的static中间件：

	var path = require('path');
	var fs = require('fs');
	
	module.exports = function(root, options) {
	  return function(req, res, next) {
	    var filepath =root + req.pathname;
	    fs.readFile(filepath, function(err, data) {
	      if (err) {
	        next(err);
	      } else {
	        var extname = path.extname(req.pathname);
	        var mimeType = (function getMime(extname) {
	          return mime[extname] || 'text/plain';
	        })(extname);
	        res.writeHead(200, {'Content-Type': mimeType});
	        res.end(data);
	      }
	    });
	  }
	}
	
	var mime = {
	  '.html': 'text/html',
	  '.css': 'text/css',
	  '.js': 'text/javascript',
	  '.png': 'image/png',
	  '.jpg': 'image/jpg'
	}

基本就是输出一个返回函数的函数啦。

注意里面的重点！就是这个next函数

next函数
---------
今天中午前还看不懂next函数，但下午一下子就懂了，非常简单嘛。就是我之前写的`tryMatch()`函数。把它当变量每次都传入stack的回调函数中。

这样，中间件可以自己选择继续匹配下去或者结束匹配。

比如上面的static，当文件不存在的时候，执行`next()`,本质就是执行`tryMatch()`继续尝试匹配下面的。如果文件存在，就可以直接`res.end()`了，也就不会next继续传下去了。

总结
------
express真棒~,我真聪明￣▽￣




