title:事件驱动解决异步递归
tag:nodejs
date:2013/2/22

###前言

一直觉得自己已经能比较轻松的完成一些简单需求了。

但是有一个问题一直困扰着我，正如题目所示。我不会写异步的递归调用。

曾经我甚至分不清同步异步函数。经常把同步的函数写到异步方法中去

但是我喜欢写一些开放平台的sdk，每每遇到需要递归处都用同步的方法敷衍过去。

比如文件目录遍历，我都是先遍历好再传递callback的。。

对此我非常羞愧，把那些同步函数后面加上Sync，比如listFile()改为listFileSync(),来警示自己只会用同步函数。

异步比同步高级很多。除了并行带来速度上的优势，也很好的防止了雪崩式阻塞。

然而写异步函数却完全和同步函数不同。

还是文件遍历的例子

先看同步的文件遍历。

	:::javascript	
	function listFileSync(rootpath){
		var fpath = rootpath || __dirname;
		var result = [];
		var objArr = fs.readdirSync(fpath);
		for(var i = 0; i < objArr.length; i++){		
			var _file = path.join(fpath,objArr[i]);
			var _stat = fs.statSync(_file);
			if(_stat.isFile()){				
				result.push(_file);
			}else{			
				var  _fileArr = listFileSync(_file);	
				for(var j = 0; j < _fileArr.length; j++){	result.push(_fileArr[j]);
				}
			}
		}
		return result;
	}
	
这就像一年级学的那样简单。

然而异步就彻底搞晕我了

###异步中的猜测
	
###异步递归的解决方法

此处用的是nodejs中的events。

首先定义一个监听器。（可能是android的习惯叫法。）

	:::javascript
	function Listener(){
		events.EventEmitter.call(this);
	}
	util.inherits(Listener, events.EventEmitter);

这就定义了一个监听器，方法完全是网上抄来的。

同时我们设置两个信号`file`和`dir`

显然，这个目的是为了

	:::javascript
	function Listener(){
		var self = this;
		this.count = 0;
		this.files = [];
		events.EventEmitter.call(this);	
		this.on('file',function(file){
			this.files.push(file);		
		});
		this.on('dir',function(dir){
			self.walk(dir);
		});	
		return self;
	}

在收到file信号的时候将参数（文件路径）存入数组。

在收到dir的时候递归调用遍历函数。

如上所示，我们管这个遍历函数叫walk()

####walk()怎么写？

	:::javascript
	Listener.prototype.walk = function(mypath){
		var self = this;	
		fs.readdir(mypath,function(err,result){
			self.count += result.length - 1;
			result.forEach(function(file){
				var _path = path.join(mypath,file);
				fs.lstat(_path,function(err,stat){
					if(err){
						console.log(err);
					}
					if(stat.isFile()){
						self.count --;
						self.emit('file',_path);
					}
					else{
						self.emit('dir',_path);
					}
					if(self.count < 0){
						self.emit('end');				
					}
				});
			});
		})
	}

看到最后你一定明白了，通过非常麻烦的count计算，如果count小于0了，就发出`end`信号。

而在Listener()这个构造函数中我们返回了self

使用的时候只需

	:::javascript
	var walker = new Listener();
	walker.on('end',function(){
		console.log(this.files);
	});
	walker.walk(__dirname);

看到程序返回正确结果的时候，我只能说真爽。

学会这样的事件驱动编程，我觉得可以算是nodejs真正入门了





	


