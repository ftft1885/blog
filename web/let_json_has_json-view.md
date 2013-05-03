title:让json有json-view的方法
tag:web
date:2013/1/27

JSON的规范（美观）输出

大家一定都知道

>JSON.parse()

>JSON.stringify()

这两个函数

但是仅仅使用JSON.stringify()转化出的json用编辑器或者网页打开就是一坨。

我们来看下mozilla怎么说的

[https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/JSON/stringify](https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/JSON/stringify)

看到最后你一定乐了


	:::javascirpt
	var json = {
		key1	:	value1,
		key2	:	value2
	}
	JSON.stringify(json,null, "\t"); 

现在你在用网页或者编辑器打开看试不试就是json-view了。

__注意 网页的json mime类型为 `application/json`__

当然，这样写并不代表你用notepad或者非json方式打开也是有json-view的，

只有用notepad++或者vim这种高级的编辑器才有