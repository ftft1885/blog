title:js中的继承
tag:javascript
date:2013/4/1

js中的继承

上次我写了一篇原型链，感觉自己果然是瞎想。

时过几日，我对js的继承有了新的认识

首先继承有两种。

基于类型的继承。这个类型和其他oo中的类差不多。

	function ParentClass(name){
		this.name = name;
		this.sayHello = function(){
			console.log("my name is "+this.name);
		}	
	}
	
	function SonClass(name,nickname){
		this.nickname = nickname;
		//this.name = name;		
		ParentClass.call(this,name);
	}
	SonClass.prototype = new ParentClass();	
	
	var son = new SonClass('son','Kate');
	son.sayHello();

这个call就是用来传参数的，因为我们在给SonClass继承ParentClass的时候并没有传参数。需要在声明这个构造函数的时候用call传参数。

call当然不是为了传参数。我们需要了解它的本质

上面的函数我们输出`son`

	SonClass {nickname: "Kate", name: "son", sayHello: function, age: 19, name: undefined…}
		age: 19
		name: "son"
		nickname: "Kate"
		sayHello: function (){
			__proto__: ParentClass
			name: undefined
			sayHello: function (){
			sayNickname: function (){
				__proto__: ParentClass


可以看到了两个sayHello。下面`__prototype__`中的属性是复制给son的呢？还是仅仅是引用

这个试一下就知道了

	son.__proto__.name = "SonKate";
	var john = new SonClass();
	john.__proto__.sayHello(); // output: SonKate

可以看出原型链是引用，并没有复制到son中，修改son中的属性会污染整个SonClass构造函数，话说我不是new的吗？new只是new `__proto__`上面的，`__proto__`中的属性还是引用

###没有call的写法

	function ParentClass(name){
		this.name = name;		
	}
	
	ParentClass.prototype.sayHello = function(){
		console.log(this.name);
	}
	
	function SonClass(name,nickname){
		this.nickname = nickname;
		this.name = name;			
	}

	SonClass.prototype = new ParentClass();	
	SonClass.prototype.sayNickname = function(){
		console.log("my nickname is " + this.nickname);
	}	
	
	var son = new SonClass('son','Kate');
	son.__proto__.name = "SonKate";
	console.log(son);
	son.sayHello();

	SonClass {nickname: "Kate", name: "son", name: "SonKate", sayNickname: function, sayHello: function}
		name: "son"
		nickname: "Kate"
		__proto__: ParentClass
			name: "SonKate"
			sayNickname: function (){
			__proto__: ParentClass
				constructor: function ParentClass(name){
				sayHello: function (){
				__proto__: Object

sayHello()函数在最底层，没有与它并列的name属性。但是`son.sayHello();`的值是多少呢？

结果为son。因为sayHello函数中的this指向`__proto__`,它会不停的往上知道遇到实例对象为止。最高处的name就是它选择的值。

	function SonClass(name,nickname){
		this.nickname = nickname;
		//this.name = name;			
	}

如果我们去掉,结果当然是输出SonKate，可以认为不管在原型链上哪里的函数，他的this永远从最高处开始检索。

那call的意义何在呢？

当使用prototype给ParentClass扩展方法时，他们毫无区别。

当用this直接定义方法时（内联函数？），call也会给SonClass复制这个方法。（会多占一些内存？除了这个也没看出区别。）

	function ParentClass(name,age){
		this.name = name;
		this.age = age;
		this.sayHello = function(){
			console.log("my name is "+this.name+"; my age is "+this.age);
		}	
	}
	
	function SonClass(name,age){
		//this.name = name;
		//this.age = age;	
		ParentClass.call(this,name,age);
	}
	SonClass.prototype = new ParentClass();
	
	var son = new SonClass('John','20');
	console.log(son);

这就是call的真实意义，当属性很多的时候，可以少写几行代码

###用call不能在继承父类时初始化

call复制方法。我们知道底层链的方法总是会往上寻找this的属性。

但是反过来处于高层链的方法并不会到底层去找this的属性。

对于有默认值的子类型构造函数

	function ParentClass(name,age){
		this.name = name;
		this.age = age;
		this.sayHello = function(){
			console.log("my name is "+this.name+"; my age is "+this.age);
		}		
	}
	
	function SonClass(name,age){
		//this.name = name;
		//this.age = age;	
		ParentClass.call(this,name,age);
	}
	SonClass.prototype = new ParentClass('defaultname','defaultage');
	
	var son = new SonClass('John');	

由于call把ParentClass中的方法直接复制到了SonClass上，sayHello()变为SonClass的内联函数。而继承时默认的属性值处于__proto__下。如果实例化SonClass的时候不写全参数，输出就会这样

	son.sayHello();
	//----output:
	my name is John; my age is undefined 

正确的默认初始化

	function SonClass(name,age){		
		var _name = name || 'defaultname';
		var _age = age || 'defaultage';
		ParentClass.call(this,_name,_age);
	}
	SonClass.prototype = new ParentClass();
	
	var son = new SonClass('John');

所以我发现用call的话就跟那个原型继承没关系了。

	function SonClass(name,age){		
		var _name = name || 'defaultname';
		var _age = age || 'defaultage';
		ParentClass.call(this,_name,_age);
	}	
	
	var son = new SonClass('John');

一样么。。所以我还是不能理解为啥call和prototype一起用。

谁能教教我，我请吃饭。

总之多了那句话唯一的区别就是构造函数从SonClass变成了ParentClass。我见过有人这么写

	SonClass.prototype.constructor = SonClass;

不能理解为啥费这么大劲先改成ParentClass再改回SonClass。





