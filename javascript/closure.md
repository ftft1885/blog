title:闭包扯淡
date:23:44 2013/6/6
ignore:1

前言
-------
貌似每个前端都会写下闭包的概念,来记录自己对闭包的理解,最近又看到几篇"理解闭包."之类的blog,大都是按照js高级编程的顺序背了遍书,感觉依然不清楚,所以还是跟风写闭包吧,毕竟是前端面试必问的题呢.

[demo页](http://fimg.oss.aliyuncs.com/js/closure.html)

对闭包的疑惑来自于这个问题,我们想让一组button点击后弹出"我是第几个button.",几乎每个初学者都会碰到这个问题.

见demo第一组button.

	var str = "I'm button "
	var btnArr1 = document.querySelectorAll('.test1');
	for (var i = 0; i < btnArr1.length; i++) {
		btnArr1[i].onclick = function() {
			alert(str + i);
		}
	}

这样写怎么看都是对的,为啥输出的都是4呢?

我们查看下button的onclick

	console.log(btnArr[i].onclick);
	// output---------------
	function () {
		alert(str + i);
	}

可以看到绑定了一个函数,里面输出的是i.那么i等于多少呢?

	console.log(i)
  	// output---------------
	4

是了,我们可以大致猜到我们的i是在点击的时候取得,而这个时候i已经变成4了(for循环结束).

于是会想出来一种比较猥琐的方法.
		
	var btnArr2 = document.querySelectorAll('.test2');
	for (var i = 0; i < btnArr2.length; i++) {
		btnArr2[i].count = i+1;
		btnArr2[i].onclick = function() {
			alert(str + this.count);
		}
	}

我们把button的次序绑定在button自己的count属性上,再测试一下(demo第二组),发现已经正常了.因为alert的值是自己的count值,已经不管i是多少了.

那为什么count是直接赋值成i的值(已经被赋值成1,2,3..),而onclick中的alert中的i却还是i呢?

那是因为button的count是直接赋值的,而onclick是赋值给了一个匿名函数,这个匿名函数并没有运行,只是声明一下而已.也就是说onclick中所有内容,都要等到button真正被点击的时候才会运行,所以匿名函数

	function() {
		alert(str + i);
	}

只有在被点击的时候才会去取i的值.在声明的时候他甚至不知道自己要alert..

于是我们想到如何能让函数预先知道i的值,那就不会错啦.

	var btnArr5 = document.querySelectorAll('.test5');
	for (var i = 0; i < btnArr5.length; i++) {
		var getFunc = function(count) {
			return function() {
				alert(str + count);
			}
		}			
		btnArr5[i].onclick = getFunc(i+1);
	}

这也是一段可以达成需求的代码,来看一下为什么是对的.

button的onclick赋值为getFunc(i+1),也就是变为了getFunc的返回值.

getFunc这个函数看名字就知道是返回一个函数.恩,这个函数返回一个函数.函数的内容是`alert(str + count);`,str是我们的全局变量,count是啥呢?是getFunc的参数,onclick赋值的时候getFunc的参数为i+1.

我们尝试输出随便一个button的onclick

	console.log(btnArr5[1].onclick)
	// output ------------------
	function () {
		alert(str + count);
	}

这里面的内容依然不是具体的button是第几个的确切值,还是一个变量count,但是这个count是多少呢?我们无法输出count,因为count是一个getFunc的变量,无法通过控制台获取(匿名函数中的变量不能通过全局变量访问到.如图)

但是这段代码结果确实是对的呀.

于是我们就发现这个小小的问题里面居然有个闭包的概念.由于全局变量button可以通过onclick这个属性访问到

	function() {
		alert(str + count);
	}

这个匿名函数(getFunc的返回值),而这个匿名函数是属于getFunc(i+1)中的.count的值为i+1,在button被点击的时候,count找不到定义的值,按照作用域继续往上找,在getFunc(i+1)找到了count的值,也就是i+1.而i是多少呢?i早就在for循环中就被赋值为确定值了,为啥这次i被替换了之前没有呢?因为getFunc(i+1)是执行了函数,而不是声明函数,他在循环中确切的执行了getFunc(1),getFunc(2)这些函数.

所以alert()中的值是对的啦.

这段代码可以用`立即执行函数`简化一些

啥叫`立即执行函数`?

js中在声明函数后面加上`()`可以声明后立即执行一遍

	function () {
	
	}()

就是这样啦,这个函数没有名字,是匿名函数,但是它定义完执行了一遍.

相当于

	var foo = function() {
	
	}
	
	foo();

只不过没有foo这个变量而已.

要注意的是`(function(){})()`也是立即执行函数啦,多个括号并没有区别(据说语法解析上会有区别,但是谁管呢?咱又不是编译器).在`可维护的javascript`中明确表示这种写法是为了好看.

上一段函数被简化成这样.其实还是一样的啦.

	var btnArr3 = document.querySelectorAll('.test3');
	for (var i = 0; i < btnArr3.length; i++) {			
		btnArr3[i].onclick = function(count) {
			return function() {
				alert(str + count);
			}
		}(i+1);
	}

这种写法被称为`正确的写法`,也是运用闭包最典型最简单的例子.

玉伯大大说过,前端完全不需要懂闭包,我认为这是正确的,我们甚至不需要知道这个概念,闭包到底是一种功能还是一种特性?我觉得闭包不是一种功能,语言本来就该是这样的.

在`js高级编程`中也说了闭包和匿名函数很难区分.有些人甚至认为函数返回值是匿名函数这种写法就是闭包.

闭包的内存隐患
---------
在F12中的Profiles的Take Heap Snapshot中


待续...........


	