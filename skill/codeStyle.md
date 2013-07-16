title:编码规范
date:21:02 2013/7/16

上次有篇文章怒黑编码规范，[编码规范是技术上的遮羞布](http://developer.51cto.com/art/201307/402559.htm)

我不以为然，按照编码规范写出的代码可读性好的不是一点半点。如果和别人合作编码，我会首先说好基本的编码标准。

编码标准和编码风格，这是两个不同的概念。必须遵照的是编码标准，而编码风格属于自由发挥，但要全片统一。

总结下js的编码标准和风格，因为js是完全的C-style语言。其他C-style语言我也按这个标准写。

###缩进

缩进在其他语言属于编码风格，但是在JS上属于编码规范。规范是2空格。

缩进的主要风格是分三种，制表符，4空格，2空格。最近的项目还有3空格的。

jQuery和Dojo的编码准则是制表符。不过也可以看到，制表符在github上浏览让人崩溃，看起来向山寨代码一样。这就是制表符不能用来当缩进的原因，系统，编辑器，浏览器，个人设置，都会导致制表符显示的长度不同。没有达到一致性的需求。

那为什么是2空格而不是4空格呢。首先是因为js多用于网络传输，空格多了浪费带宽。第二是因为js是回掉式语言，很容易就写出回掉金字塔。4空格会使得代码太斜。第三个是因为一个程序如果健壮，那错误处理一定占了很大的百分比，而错误处理会有大量的if或者其他控制流语句，也会让代码很斜。

也许你会觉得2空格看清楚。但还是要赶早紧随大流，而今大多项目的缩进都是2空格。习惯4空格会导致看2空格有些不适。vim是使用

	:set ep		# expandtab

来把tab键改成空格的

本片代码中是用制表符因为我实在windows下写的。


### 分号

分号属于编码风格，可以有也可以没有。在可维护的JS中提到ASI（自动分好插入）机制。所以作者推荐使用空格，不幸的是JS的爸爸在一段代码演示中完全没用分号。分号写或不写没有明确的好坏之分，因此属于编码风格。

### 大括号

大括号是js和c不同的地方。

c中推荐大括号在同一列

	{
		{
			...
		}
	}

而js必须是

	function sayName() {
		alert(name)
	}

左大括号不得另起一行，原因很简单
	
	function getData()
	{
		return 
		{
			name: 'myname',
			age: 20
		}
	}

如果用同一列的话，分析器肯定会当成这种

	function getData()
	{
		return;
		{
			name: 'myname',
			age: 20
		}
	}

程序永远只能返回undefined了。因此，左大括号不换行是明确的编码规范。

### 换行

换行属于编码风格

	var a,
		b,
		c;
	
	var a
	  , b
	  , c

完全是自己喜好,可维护的JS中推荐运算符放在最后，这样明确表示一句话没有结束。

### 空行

控制流语句的空行
	
	if (wl && wl.length) {
		
		for (i = 0, l = wl.length; i< l; i++) {
			
			balabala...
		}
	}

空行同样属于编码风格。

### 命名

> 计算机科学只存在两个难题： 缓存失效和命名 -- Phil Karlton

命名属于编码标准，变量使用小驼峰（camelCase）（第一个单词首字母小写，后面单词首字母大写）

	var thisIsMyName;
	var anotherVar;
	var aVeryLongVariableName;

常量使用全大写和下划线

	var MAX_COUNT = 10;
	var GLOBAL_URL = "biedalian.com";

构造函数使用大驼峰（Pascal Case）（每个单词首字母大写）

	function Person(name) {
		this.name = name;
	}

布尔类型使用固定前缀has, is, can

	var isFile = true;
	var hasParent = false;

### 字符串

字符串在js中双引号和单引号无区别，属于编码风格， 只需保持全片一致即可。

### 单行注释
	
	// 这是单行注释

双斜线后面必须有空格，属于编码规范

	if (condition) {
		// check pass
		pass();
	}

缩进与后文一致

	if (condition) {
	// check pass
		pass();
	}

这样是错误的。

### 多行注释

多行注释同样是严格的编码标准。

多行注释分两种，一种是文档级api注释，一种是用于解释或者权限申明的多行注释

#### api注释使用

	/**
	 * Get value by HTTP header name
	 *
	 * Examples:
	 *
	 *     var contentType = res.get('content-type');
	 *
	 * just as same as inside response.getHeader()
	 * so the header name is case insentive
	 * can only be called before the http header is sent
	 *
	 * @param {String} name
	 * @return {String}
	 * @api public
	 */

以前我也不懂为什么注释能写成这样，直到我做了个注释生成api网页的东西才明白。

需要进入文档的注释推荐使用`/** ... */`, 即便是单行文档注释

	/** this will add to document */

文档注释在各种文档生成工具中都有讲解，超出了本文的范围。


#### 非api的注释推荐使用

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:

如果想要用原生的多行注视，应该是

	/*!
		this 
		is 
		multi
		comments
	 */

比较时髦人性化的文档生成工具会忽略`/*! */`这样的注释。

### 块语句间隔

	// 正确
	if (condition) {
		doSomething();
	}
	
	// 错误， if， 条件语句， 左括号之间没有空格
	if(condition){
		doSomething();
	}
	
	// 错误, 条件语句和左括号之间没有空格
	if (condiftion){
		doSomething();
	}
	
	
	// 错误， if和条件语句之间没有空格
	if(condition) {
		doSomething();
	}

	// 错误，条件语句前后有空格
	if ( condition ) {
		doSomething();
	}

至于为什么条件语句前后有空格，这完全因为如果括号间统一加空格会造成大量灾难。因为调用函数，提高优先级等都会用到括号，而事实上，括号中加上空格看起来过于松散。括号本来就有分隔的作用，加空格是多余且错误的。

明天北上培训啦，睡觉，待续。。

