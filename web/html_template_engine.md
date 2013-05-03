title:html模板引擎
tag:web
date:2013/2/11

现在写网页要是不知道html模板引擎那简直是out了。

不过模板引擎实在繁多，我又懒得去研究它们的用法。于是想自己试着写写玩

html模板引擎说白了就是把html语言和js结合起来

最简单的例子1

	:::javascript
	<h1><%year%>年大吉</h1>
	//真正的引擎一般是
	<h1><% =year %>年大吉</h1>//有个‘=’号
	//为什么要有=号呢？我不解，刚开始觉得=号是多余的

渲染的时候只需
	
	:::javascript
	render(id,{year:"蛇"});
	
就行了
+ id:指的是html模板的id
+ 第二个参数是一个json。里面放的是变量如`year`对应的值

模板引擎的好处显而易见，如果不用这个模板引擎

那我们只能这么写

	:::javascript
	var year = '蛇';
	var html = '<h1>'+year+'年大吉</h1>';

也许你觉得这样写也无所谓。那你得看看下面的例子2

	:::javascript	
	<ul>
	<%  for(var i = 0; i < year.length; i++){ %>
		<li><%year[i]%>年大吉</li>
	<% } %>
	</ul>
	//-----
	render(id,{year:['鼠','牛','虎','兔','龙','蛇','马','羊','猴','鸡','狗','猪']});

总之。html模板的写法要比直接写出html优雅许多。

+ 你不需要去考虑'\n'之类的排版问题。
+ 省掉了许多杂乱的引号 ' | "  
+ 模板的变量不会去污染其他命名空间

说了这么多我们终于要开始写了，不过说实话，我写到这的时候完全没试着写过这样的东西。心里还是非常忐忑，担心又充胖子被打脸。

首先我们要知道在哪里写template代码

	:::html
	<script id="mytemp" type="text/html">
		<h1><%year%>年大吉</h1>
	</script>

没错，就是写在`<script>`标签里，`<script>`标签默认的type为`text/javascript`

这里写成`type="text/html"`

浏览器就直接忽略这里面的东西了，于是我们可以像普通html那样排版的写模板代码。

当然这里面的html是没有高亮的，js代码才有，如果html多而且又有高亮强迫症 的话可以先把script写改成div，写完再改回script。

##1.首先我们获得原始模板代码

	:::javascript
	function render(id,data){
		var source = id;
		if(id.indexOf('<') === -1){
			source = document.getElementById(id).innerHTML;
		}
	}

嗯，这样写就支持

+ render('mytemp',data);
+ render(`'<h1>+year+年大吉</h1>'`,data)

两种写法了。

##2.拆分html和js代码部分。

哦，这个例子1的js部分就是year，他是个js中的变量。。
例子2中的js部分是那个for语句。

	:::javascript
	var funcCode = "";
	funcCode += genVal(data);
	var _start = "<\%";
	var _end = "%>";
	var srcArr = source.split(_start);
	for(var i = 0; i < srcArr.length; i++){
		var tempCode = srcArr[i].split(_end);
		if(tempCode.length === 1){
			funcCode += genHTML(tempCode[0]);
		}
		else if(tempCode.length === 2){
			funcCode += genJS(tempCode[0]) + genHTML(tempCode[1]);			
		}
	}
这里设置了开始标签`<%`和结束标签`%>`

当然你可以设置自己喜欢的`<!`和`!>`，`{{`和`}}`之类的,不过大部分模板都是用上面这种，原则是要有括号这种来区分左右的而且和原有的语法不冲突即可。

上面代码就是先split _start，然后再分别split _end

如果返回的数组长度是1，那说明完全是html代码，否则如果长度2，则arr[0]是js代码，arr[1]是html代码。

于是就有了专门处理html和js的俩函数
genHTML（）和genJS（）

##3.分别处理html和js代码

	:::javascript
	function genJS(str){
		var funcCode = "";
		if(str.split(' ').length === 1){//这是瞎写的，用来辨别是否是变量
			funcCode = "output += "+str+";\n";
		}
		return funcCode;
	}	
	//此处生成这样的funcCode
	output += year;

	function genHTML(str){
		str = str.replace(/\n/g,'\\n');
		var funcCode = 'output += "'+str+'";\n';
		return funcCode;
	}
	//注意这里要写更多的replace来转义，比如引号之类的。
	//此处生成这样的funcCode
	output += "\n<h2>\n";
	output += "年吉祥！\n</h2>\n";

当然，函数里是没有year这个变量的，接下来我们要做的就是声明变量

##4.声明变量

变量当然都是data里的变量

我们只需在funcCode最前面加入即可

	:::javascript
	function genVal(data){
		var funcCode = "";
		for(var key in data){
			funcCode += 'var '+key+' = data.'+key+'\n';
		}
		funcCode += "var output = '';\n";
		return funcCode;
	}
	//哦，别忘了声明output，他是我们返回的大变量！
	//测试一下：
	var data = {
		year : '蛇',
		arr : [1,2,3],
		json:{
			key:'value'
		}
	}	
	console.log(genVal(data));
	//输出结果
	var year = data.year
	var arr = data.arr
	var json = data.json
	var output = '';

嗯，非常正确。

##5.生成函数（这个是关键，我们做的所有事情其实就是为每个模板专门生成一个处理函数）	

	:::javascript
	funcCode += "return output;"
	var genFunc = new Function('data',funcCode);
	var result = genFunc(data);
	return result;	

啊。没错，这个实在非常简单。末尾加上一个return函数然后生成函数即可。
我们看看生成了什么

	:::javascript
	function anonymous(data) {
	var year = data.year
	var output = '';
	output += "\n<h2>\n";
	output += year;
	output += "年吉祥！\n</h2>\n";
	return output;
	} 

确实生成了这个既有变量声明又有字符串处理的模板生成函数，当然他没有缩进（有换行不错啦）。

我们来看看结果吧` render('mytemp',{year:'蛇'})`

	:::html
	//原始数据
	<h2>
	<%year%>年大吉！
	</h2>
	//转换后数据
	<h2>
	蛇年大吉！
	</h2>

成功了！不过我们花这么大劲就把year换成'蛇'？

##6.支持js代码

对了，模板不是还能支持数组什么的么

于是我们试了下这个模板

	:::html
	<script id="temp2" type="text/html">
	<ul>
		<%for(var i = 0; i < year.length; i++){%>
		<li><%year[i]%>年大吉</li>
		<%}%>
	</ul>
	</script>	

	render('temp2',{year:['鼠','牛','虎','兔','龙','蛇','马','羊','猴','鸡','狗','猪']});

哦，他一定报错了，因为for语句这样的js代码和year[i]是不一样的，

year[i]应该和html代码一样用output += year[i]加上去。

而for则是直接写上去就行了。

于是我们终于明白为什么year[i]这种变量前要加上=号了。这告诉模板引擎这是要加上去的。

当然你也可以自己写个函数来区分到底是转换值还是js代码，不过很麻烦罢了

于是我们重写genJS(str)这个函数
	
	:::javascript
	function genJS(str){
		var funcCode = "";	
		if(str.indexOf('=') === 0){
			funcCode += "output += "+str.substring(1,str.length)+";\n";
		}
		else{
			funcCode += str+'\n';
		}	
		return funcCode;
	}

加上`=`号。。

	:::html
	<script id="temp2" type="text/html">
	<ul>
		<%for(var i = 0; i < year.length; i++){%>
		<li><%=year[i]%>年大吉</li>//多了个=！
		<%}%>
	</ul>
	</script>	
	
嗯，这个函数是最雏形的，还应该去掉空格什么的。只是笔者实在笨又懒

再试一下，

	:::javascript
	function anonymous(data) {
	var year = data.year
	var output = '';
	output += "\n<ul>\n	";
	for(var i = 0; i < year.length; i++){
	output += "\n	<li>";
	output += year[i];
	output += "年大吉</li>\n	";
	}
	output += "\n</ul>\n";
	return output;
	} 


成功生成这个函数！

结果也是显然的
	
	:::javascript
	render('temp2',{year:['鼠','牛','虎','兔','龙','蛇','马','羊','猴','鸡','狗','猪']});

+ 鼠年大吉
+ 牛年大吉
+ 虎年大吉
+ 兔年大吉
+ 龙年大吉
+ 蛇年大吉
+ 马年大吉
+ 羊年大吉
+ 猴年大吉
+ 鸡年大吉
+ 狗年大吉
+ 猪年大吉

总结：嗯，大家一定知道怎么自制模板了。

不过，这些都是我自己想当然的。

真正的模板引擎是不是这个原理，我并不知道。还是建议大家看看别人的源码。

最后祝大家render("<%=year%>年大吉",{year:'蛇'})！


