title:cssplusplus-2
date:21:20 2013/5/17

目前css预编译已经变成4个小文件了

+ predo.js

+ lex.js

+ parser.js

+ compile.js

增加的predo.js就是为了完成maxin(混合)的功能

完成变量和嵌套后,我在混合上走了很大的弯子.

maxin同样是一个用处非常广泛的功能,也是省去大量css代码的原因

我一开始以为maxin是类似函数的东西,因为声明的格式都是

	rule(key: value) {
		.. 
		..
	}

看起来特像函数,结果我一直想不通怎么做.

后来发现, 这貌似是像c那样的宏啊我去!

宏定义是预处理的一部分

predo这个名字就是这么来的, (偶实在想不好处理的英文.)

总之预处理一下走就到了lex词法之前了.

写预处理的时候我发现真的可以做很多事情,比如import功能, maxin, 以及去注释, 兼容更多格式等.

知道预处理了, 那maxin就没了技术含量..变成了一堆n长的正则..

maxin的数据结构
---------
maxin全都存在一个hash中, 本身也是对象, 有key, val, content三个属性.

	function getType(type, _val) {
		if (type in maxins) {    
			var val = _val || maxins[type].val;
			var output = maxins[type].content;
			var _reg = new RegExp(maxins[type].key, 'g');
			output = output.replace(_reg, val);
			return output;
		}
	}

对使用maxin的语句进行替换就行了. 要注意的是使用maxin有3种写法

	rule(value);
	rule(); // default
	rule; // default

而`rule;` 属于`key: value;`的子集, 所以写正则一定要注意`[^:]`

展示下成果

	rule(mycolor: red) {
	  color: mycolor;
	  background: mycolor;
	}
	
	border(@radius: 5px) {
	  border-radius: @radius;
	  -webkit-border-radius: @radius;
	  -moz-border-radius: @radius;
	}
	
	div {
	  border(2px);
	}
	
	h1 {
	  rule;
	}
	
	h2 {
	  border;
	  rule(blue);
	}
	
	#header {
	  color: #222;
	  font: bold 20px "雅黑";
	  button > div  {
	    background: #ccc;
	  }
	  &:hover {
	    color: red;
	  }
	  background: #333;
	}
	
	#footer > div{
	  font-size: 2em;
	  width: @test;
	  span {
	    color: #999;
	  }
	}
	
	.box + p{
	  font-weight: bold;
	}

一个复杂的css++文件!

转换后:

	div {
	  border-radius: 2px;
	  -webkit-border-radius: 2px;
	  -moz-border-radius: 2px;
	}
	
	h1 {
	  color: red;
	  background: red;
	}
	
	h2 {
	  border-radius: 5px;
	  -webkit-border-radius: 5px;
	  -moz-border-radius: 5px;
	  color: blue;
	  background: blue;
	}
	
	#header button > div {
	  background: #ccc;
	}
	
	#header:hover {
	  color: red;
	}
	
	#header {
	  color: #222;
	  font: bold 20px "雅黑";
	  background: #333;
	}
	
	#footer > div span {
	  color: #999;
	}
	
	#footer > div {
	  font-size: 2em;
	  width: #testval;
	}
	
	.box + p {
	  font-weight: bold;
	}
	
转换后的正常css.其实正不正常偶没实际用,看起来是正常的..

准备继续做的是内嵌函数以及css顺序.



compile之前的中间代码

	[ [ [ 'div', 'border-radius' ], '2px' ],
	  [ [ 'div', '-webkit-border-radius' ], '2px' ],
	  [ [ 'div', '-moz-border-radius' ], '2px' ],
	  [ [ 'h1', 'color' ], 'red' ],
	  [ [ 'h1', 'background' ], 'red' ],
	  [ [ 'h2', 'border-radius' ], '5px' ],
	  [ [ 'h2', '-webkit-border-radius' ], '5px' ],
	  [ [ 'h2', '-moz-border-radius' ], '5px' ],
	  [ [ 'h2', 'color' ], 'blue' ],
	  [ [ 'h2', 'background' ], 'blue' ],
	  [ [ '#header', 'color' ], '#222' ],
	  [ [ '#header', 'font' ], 'bold 20px "雅黑"' ],
	  [ [ '#header', 'button', '>', 'div', 'background' ], '#ccc' ],
	  [ [ '#header', '&:hover', 'color' ], 'red' ],
	  [ [ '#header', 'background' ], '#333' ],
	  [ [ '#footer', '>', 'div', 'font-size' ], '2em' ],
	  [ [ '#footer', '>', 'div', 'width' ], '#testval' ],
	  [ [ '#footer', '>', 'div', 'span', 'color' ], '#999' ],
	  [ [ '.box', '+', 'p', 'font-weight' ], 'bold' ] ]

附上源码地址

<https://github.com/ftft1885/cssplusplus>


feature work
------------
准备写一个js的状态机或者js版本的bison来专门解析文法..nnd..被同学说其实我没分清ll和lr.

使用格式将是

	addStmt({
		left: 'xxx',
		right: [xx, xx, xx],
	 	cb()
	});

准备先实践下偶的这个css++, 论文的css就用这个写好了	
	





