title:正则学习
date:9:22 2013/4/5

前言
--------

一直不会正则，这是在是太遗憾了。一直避免这正则的使用，我觉得这完全是走捷径。以至于上次用perl解析.conf文件的那个程序，我是一个一个节点解析成父子关系，用了大量的if语句（perl没有自带switch）。

现在的问题是动态样式表的语法完全是一个小脚本语言。不可能像xml那样去解析。生成AST是不可避免的，所以正则也不可避免了

正则
--------

[非常权威的正则指南](https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/RegExp)

在js中正则有两种时候，一种是String方法中使用，一种是RegExp对象

`RegExp`是js的一个类型对象

	var reg = new RegExp();
	console.log(Object.prototype.toString.call(reg));

	// output: [object RegExp]

 >new RegExp(pattern, attributes);

 >参数1是一个规则字符串，参数2是匹配模式

重要的是参数1，匹配规则。

RegExp有3中方法。`test()`,`exec()`,`compile`

 >test()返回boolean，检查有没有匹配到

 >exec()可以返回匹配到的值

 >compile用来改变RegExp中pattern和模式的值。

可以看出唯一重要的就是`exec()`了

拿less中的首页例子来实验。常见的都有了

	@base: #f938ab; // variable
	
	.box-shadow(@style, @c) when (iscolor(@c)) {
	  box-shadow:         @style @c;
	  -webkit-box-shadow: @style @c;
	  -moz-box-shadow:    @style @c;
	}
	/*
	 * this is multiply lines comment
	 */
	.box-shadow(@style, @alpha: 50%) when (isnumber(@alpha)) {
	  .box-shadow(@style, rgba(0, 0, 0, @alpha));
	}
	.box { 
	  color: saturate(@base, 5%);
	  border-color: lighten(@base, 30%);
	  div { .box-shadow(0 0 5px, 30%) }
	}

1. 首先试试匹配变量
----------------

	var reg = new RegExp('@\\w+','g');
	var output = reg.exec(str);
	console.log(output); // [@base,index:3,....]

`@\\w+`是啥？

@是变量符，我们需要匹配的，。

先了解\w

\w相当于[A-Za-z0-9_]，连下划线都包括了。显然\w就是标准的变量名匹配。

`[]`是啥？匹配[]中任意一个字符。`-`就是范围啦

`\\w+`是什么呢？首先`\`是转义符。由于\本身有特殊含义，如果写成`\w`匹配的就是'\w'了，没有转义到\w,这是由于new RegExp参数是字符串的缘故。

如果用/@\w+/g 就不需要第一个`/`了。

简单的说'\\w' 相当于/\w/。

+是特殊字符，表示至少匹配一个，还有一个*，匹配任意个包括0个。

所以匹配一般变量基本都可以闭着眼睛写/\w+/

	var reg = new RegExp('xxx','g');
	var reg = /xxx/g;

就好比
	
	var arr = new Array();
	var arr = [];

一样，后者完爆前者。除非是复杂的匹配规则

要注意的是reg.exec()并不是匹配全部。
匹配全部的是String.match();

如

	var results = str.match(/@\w+/g);
	console.log(results);

2. 匹配注释
-----------------

单行注释

	var reg = /\/\/.*\n/g;

我们可以很快写出单行注释的正则。

`.`是匹配任意字符，要注意的是`//`也要转义

总结下

匹配自身需要转义的字符

	/, \, (, ),  [, ], ^, $, ?, |, +, *, .,

大括号是不需要转义的

转义后含义转变的字符

	\s, \S, \w, \W, \d, \D..很多

多行注释

多行注释一直是个难点。我以前用的时候一直都是上网搜的。

网上搜来靠谱的一个

	/(\/\*)\/?(([^\*]\/)|[^\/])*(\*\/)/g

我当初就是被这个吓到了，从此决定不再碰正则。一个多行注释就能如此复杂，我还不如用状态机呢。

显然我知道现在也没懂这条这则的原理。

不过多行注释我已经会写了，不过过程有点坎坷，一点点试错

第一次试很简单

	//*.**//g

加上转义符就行了。但是试一下就知道这样写只能匹配单行注释。碰到换行就失灵了。

前面说到`.*`匹配任意字符串。这是错的，权威网站上写的很清楚不能匹配'\n \r \u2028'这些。就是不能匹配换行

那如何才能匹配任意字符串呢？

`[^]*`，从上面那个奇葩的正则中我唯一学到的就是这个。匹配任意不属于无的。这不就匹配全部了么。。

于是正则就变成了
	
	/\/\*[^]*\*\//g

还以为成功了，结果我扔两个多行注释，发现它匹配了全部

	/*comment1*/ abc /*comment2*/

我们希望得到的是两个comment，它却连着中间不是注释的都给出来了。

这里要注意的是正则匹配有两个性格。

一个是强迫症性格，就是说就算找到了匹配，它还是要继续匹配知道没有为止，官方说法是最大匹配，或者贪婪模式

另一种是懒惰性格，匹配到一个算一个。也就是常说的最小匹配或者懒惰模式

js的正则显然是贪婪模式，最大匹配。改成懒惰模式很简单

`?`这个字符非常关键

权威网站上的话

 >If used immediately after any of the quantifiers *, +, ?, or {}, makes the quantifier non-greedy (__matching the minimum number of times__), as opposed to the default, which is greedy (matching the maximum number of times).

所以正则变成了

	/\/\*[^]*?\*\//g

这样当然还是错的。

![](comment.jpg)

这样的嵌套注释是没办法的。当然notepad++和sublime text2也不认识

刚在想怎么匹配嵌套注释，发现我特么搞错了，这样写本来就是错误的。。

总之上面的匹配是能用的样子。

3. 匹配空白
-------------

	var blanks = str.match(/\s+/g);

wuha，这个实在太简单了，或者说正则太贴心了，为我们准备了\s来匹配各种空白

4. 定位符
--------------

上面3个匹配都是处理脚本语言我想到的基本正则，实际生活中更有用的我认为应该是定位符

看mozilla上定位符的例子

	var re = /(\w+)\s(\w+)/;
	var str = "John Smith";
	var newstr = str.replace(re, "$2, $1");
	print(newstr); // output Smith, John

这种东西非常实用。

就拿less中最基本的变量来说

	@base: #f938ab;

对应的正则是

	/@(\w+)\s*:\s*([^\s]+)\s*/g

注意由于颜色中有`#`，不能用\w+

但我们并不是要匹配这段字符么认识想取出其中的base变量和base的值#ccc

这里面使用了两个括号,输出RegExp.exec()，
["@base: #f938ab; ", "base", "#f938ab;",。。。]

可以看出数组第一个值是匹配的字符串，后面两个正是括号中的内容。

空号就是传说中的定位符，把一个规则括起来就是告诉正则，把匹配子正则的内容记下来！

结语
---------

总之我感觉写词法编译，会这么多正则应该够了。






















