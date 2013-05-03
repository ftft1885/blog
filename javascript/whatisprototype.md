title:javascript中的prototype
date:23:23 2013/3/9
tag:javascript

有人说javascript根本不是个面向对象的语言，因为它没有类。

首先要知道的是prototype的中文。不要笑！估计说js不是面向对象的就连prototype中文是什么都不知道.

prototype中文是原型。

回到这个问题，显然这种说法非常幼稚，javascript数据类型几乎全是Object，它属于另一种面向对象语言，`面向原型编程`，这种面向原型编程是面向对象编程的一个子集。

javascript属于classless编程，但是深爱class的童鞋老想着给js加入class的一些特性。但是咱js爱好者一定要记住prototype就是继承！

####首先我们看看如何给一个实例附上属性的最简单的例子

	function Student(age){
		this.age = age;
	}
	var Kate = new Student(18);
	console.log(Kate.age);
	output:18

这里用到了this，这是非常对的做法。这种方法在实例化的时候直接将所有属性存入对象。当Student的方法多的时候。这种方法也会写的非常不美观。而且难以复用。

####来看第二种方法

	function Student(){};
	Student.prototype.age = 18;
	var Kate = new Student();
	console.log(Kate.age);
	output:18

这是用上prototype的方法。我们来看看我们实例化的Kate到底是什么？

	console.log(Kate);
	output:Student {age: 18} 

结果令人满意，Kate是一个object。有个age = 18的属性

我们再试试这个

	function Student(){};
	Student.prototype.age = 18;
	var Kate = new Student();
	Kate.age = 19;//这是多出来的一句
	console.log(Kate.age);
	output:19

由于Kate是一个object，我非常无聊的直接给Kate的age属性赋值为19

于是输出结果为19，这没什么不对。但是我们之前用prototype给的age=18去哪了呢？

我们只能再去输出Kate
	
	console.log(Kate);
	output:Student {age: 19, age: 18} 

有人要问了，我擦这什么玩意儿，两个age？

我们再试试这个

	function Student(){};
	Student.prototype.age = 18;
	Student.prototype.getAge = function(){return this.age}
	var Kate = new Student();
	Kate.age = 19;
	console.log(Kate)
	output:
	Student {age: 19, age: 18, getAge: function}
		age: 19
			__proto__: Student
			age: 18
			constructor: function Student(){}
			getAge: function (){return this.age}
			__proto__: Object

输出了这一堆。我们发现这两个age是不同的。一个更加“靠近”Student，另一个则在`__proto__`里面，感觉更深。

我们貌似醒悟了，不由自主的试一下这样输出

	console.log(Kate.age)
	console.log(Kate.__proto__.age);
	output: 19
			18 

啊，我们一定会这样猜测，如果没直接给Kate赋值`Kate.age = 19`,Kate.age就会找到`Kate.__proto__.age`中去找

是不是这样呢？我们来看这段略蛋疼的代码

	function Student(){};
	Student.prototype.age = 18;
	Student.prototype.getAge = function(){return this.age}
	function newStudent(){};
	newStudent.prototype = new Student();
	var John = new newStudent();
	console.log(John.age);
	output:18

`newStudent.prototype = new Student();`这句话啥意思呢，前面说过了，就是newStudent继承Student的原型。

必然的，我们得输出这个John是什么东西

	console.log(John);
	output:
	newStudent {age: 18, getAge: function}
		__proto__: Student
			__proto__: Student
			age: 18
			constructor: function Student(){}
			getAge: function (){return this.age}
			__proto__: Object

有输出了一坨，我们知道打开两个`__proto__`，才看到`age:18`

为了确定原型取值是上面我们猜的,一层接一层找的。我们继续蛋疼的赋值。

	function Student(){};
	Student.prototype.age = 18;
	Student.prototype.getAge = function(){return this.age}
	function newStudent(){};
	newStudent.prototype = new Student();
	newStudent.prototype.age = 19;//给newStudent的原型加上age=19
	var John = new newStudent();
	John.age = 20;//直接给John加上age=20
	console.log(John.age);
	output:20

结果很对，直接给实例John赋值绝对是最强的。

再次输出John
	
	console.log(John);
	output: 
	newStudent {age: 20, age: 19, age: 18}

3个age！

终于到了证明原型链的时候

	console.log(John.age);
	console.log(John.__proto__.age);
	console.log(John.__proto__.__proto__.age);
	output:
		20
		19
		18

我们总结prototype就是从obj.attr开始找，没有就找下一层`obj.__proto__.attr`,在没有就找`obj.__proto__.__proto__.attr`，直到没有`__proto__`为止。

prototype就是这么简单又实用

显然，这样的查找会耗费性能。我们找到了基于原型的编程缺点就是proto越深，性能会损失越多。不过依然还是忽略不计。当然你也可以拿一个临时变量先cache一下。




	
	


