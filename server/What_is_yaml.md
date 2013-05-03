title:yaml入门简介
tag:server
date:23:32 2013/1/23

#__优势__

做各种app都免不了要配置文件

配置文件有很多种

常见的有

> xml

> ini

> json

xml就不多说了，极其冗杂和低效

ini非常愚蠢，而且是windows的格式。其实还是不错的

json非常完美，特别是在web交互中，读写都是自带函数

不过json的问题就是不具备可读性，不是每个人都有json-view这种编辑器的

这对于需要手工修改的配置文件是致命的

也有人说用简单的

> key : value

当然这个确实太简单了，就像csv一样，没有办法显示嵌套之类的复杂逻辑

上网转了一圈，发现yaml是首选，而且大部分配置文件都是yaml的。

yaml配置文件的后缀一般是

> .yaml

> .yml

它的逻辑非常简单而且清晰

#__格式举例__

__最简单的例子__

	:::javascript
	key1: value1
	key2: value2

注意key和冒号之间没有无空格，冒号和value之间有空格。

如果你输入错误的话 不管是vim还是notepad++都会用高亮提醒你

__嵌套例子__

	:::javascript
	people:
	  Lucy:
	    name: Lucy
	    age: 16
	  Jack:
	    name: Jack
	    age: 17

可以看出yaml用类似json-view的排版。

切记：缩进不能用tab,必须用空格，一般为2空格缩进

__牛逼的是yaml可以使用注释__

	:::javascript
	hr:  65    # Home runs
	avg: 0.278 # Batting average
	rbi: 147   # Runs Batted In

格式是：空格 + # + 注释

这个功能非常关键，方便了用户知道配置文件的意思。

__yaml可以内嵌json__

	:::javascript
	people: [Lucy,Jack,Fuck]
	pic: {height:100,width:200}
	key: value

yaml还有很多功能，但是我暂时只需要上面几种。

#__工具__

yaml不能像json那样直接解析或者写。

需要找一些转换工具

在github上搜索一下js的yaml parser

前三名：

> visionmedia / js-yaml

> nodeca / js-yaml

> jeremyfa / yaml.js

第一个占了yaml的坑，小而美路线 只能parse不能stringify。气的人想吐血，貌似还不支持windows的换行

第二个[yaml.org官网](http://yaml.org)第一推荐的。反正我根本不知道怎么安装。我说你一个词法分析还要编译我去你大爷。

第三个是我现在用的，像json那样提供了yaml.parse()以及yaml.stringify()

非常完美，而且只有一个yaml.js一个文件，不依赖其他库。只是有些小错误，自己改改就好了

[网址:jeremyfa / yaml.js](https://github.com/jeremyfa/yaml.js)（Github君已阵亡，请科学上网）



