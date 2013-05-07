title:如何让程序更健壮(NODEJS)
tag:nodejs
date:11:22 2013/3/15

程序出错是非常可怕的是，尤其是服务器，服务器程序崩溃，就不能继续服务了。

nodejs程序健壮性

####1. 对可能出错的程序全部加上try() catch

####2. 完整if else判断

必须要抓住漏网之鱼

####3. 设计api

	foo(bar,function(result){})
	foo(bar,function(err,result))

显然下面的更为健壮。当然健壮的代价是繁琐

####4. 不可偷懒少了on('error')

经常网络编程的都知道`socket hang on`这种连接超时的错误。

这种IO超时无法用try catch捕捉

所以万万不能偷一时之懒少些一句话

	{ [Error: connect ETIMEDOUT] code: 'ETIMEDOUT', errno: 'ETIMEDOUT', syscall: 'co
	nnect' }

写了监听错误后就不能程序崩溃啦


####5. 谨慎对待参数

由于js是弱类型，我们要小心对待它

像`if(num){}`这是千万不能写出来的。

应为不管是'',0,undefine,null,false都会被检测排除。这样写不仅不严谨，性能上也说不过去，

还是多用`if(num === 0){}`这样的语句比较好。

同时要注意，像数组，json这种对象，很有可能长度为0或者undefine，我们不能上来就for循环一大堆。应该检查是否是可枚举&可遍历的，没问题后再循环操作。


