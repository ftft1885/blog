title:bae初探
date:0:13 2013/4/5

好不容易百度bae通过内测申请

可惜bae的nodejs文档看的我哭了，写了这么长，连根本的都没说清楚。

连网上的一般教程都不如。（一张图都没）

先看看`__dirname` 和 `process.cwd()`

	console.log('dirname : ' + __dirname);
	console.log('process.cwd() : ' + process.cwd());

不知道怎么看日志？

在 `我的应用》appname》应用日志`中。

	DEBUG:2013-04-04 23:15:21uitool.duapp.com
	--process.cwd() : instance1/nodejs/uitool.duapp.com
	
	DEBUG:2013-04-04 23:15:21uitool.duapp.com
	--dirname : instance1/nodejs/uitool.duapp.com/app

bae唯一一个常见问题。写给火星人看的。

	问：如何通过API访问代码目录下的文件，path怎么写？
	
	答：执行环境中，当前路径为代码路径的上一层路径，如要读取app.js，写法如下：
	
	fs.readFile('./app/app.js', cb);

总之所有加上`__dirname`就对了

虽然bae提供了static文件夹。我们还是来尝试写一个简单的静态文件服务器。

根目录下新建一个static文件夹。

里面放html,js,css文件。

	var port = process.env.APP_PORT || 80,
	    fs = require('fs'),
	    http = require('http'),
	    url = require('url'),
	    path = require('path');
	
	var $static = __dirname + '/static';
	var $mime = {
	    '.html': 'text/html',
	    '.js': 'text/javascript',
	    '.css': 'text/css'
	};
	
	http.createServer(function(req,res) {
	    var pathname = url.parse(req.url).pathname;
	    var extname = path.extname(pathname);
	    if (extname in $mime) {
	    
	        fs.readFile($static+pathname,function(err,data) {
	            if (err) {
	                console.warn(err);
	                res.writeHead(404);
	                res.end('404 not found');
	            } else {               
	                res.writeHead(200,{'Content-Type': $mime[extname]});
	                res.end(data);
	            }
	        });     
	        
	    } else {    
	        res.writeHead(404);
	        res.end('404 not found');
	    }
	    
	}).listen(port);

注意`var port = process.env.APP_PORT || 80,`这样才能在本地也能调试。这样写在本地正常运行，在bae上一定也是正常的。

多加点mime，这样static就成了静态文件夹了。

node_module试了下，完全跟本地一样用。

总的来说百度bae速度还是不错的啦。




