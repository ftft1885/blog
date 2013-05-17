date:20:10 2013/3/3
title:我的css&html书写准则
tag:css

###前言

我从来没学过css，当然没有人学过css，学校根本不屑于教这个。

可惜的是我连书也没看过，甚至不知道css的权重关系。

我的css水平，大概就是知道盒子模型这水平。

但是由于项目需要，我需要写大量的css。我整个人都崩溃了。

于是我给自己定了一些准则，都是自己瞎想、轻拍

###CSS准则

####1. 除非是靠右显示或者环绕显示，绝对不用float。用inline-block代替。（float脱离文档流，难以控制）

####2. class命名，充分显示嵌套关系，便于维护。

	:::html
	<div class="artical">
		...
		<div class="artical-list">
			<div class="artical-item">
			..
			</div>
			<div class="artical-item">
			..
			</div>
		</div>
	</div>

 >class名字之间用中线或者下划线连接，表示其都为artical的class

####3. 充分利用小标签

 >常见key ： value排版，我以前用`<li>`中嵌套`<span>`来完成，需要非常麻烦的给span加以class区分。

 >现在用`<dl>`,`<dt>`,`<dd>`来显示这种结构（inline-block）

 >写css的时候只需.box dt{...} .box dd{...},就行了，简洁明了

 >同理，也应该多利用`<i><b><strong>`这些小标签

####4. 对`<span>,<h1~6>,<p>`这些标签元素，多使用`line-height`来定义上下间隔

####5. 尽量少给id写css，因为id的css权重大，容易出错

####6. class的名字应该和它的意义吻合，	

 >比如一个需要靠右的`阅读全文`标签`<span>`

 >有人会这么写：`<span class="readall">read all</span>`

 >而有人则这么写:`<span class="pull-right">read all</span>`

 >一个取名readall，一个则pull-right，我非常倾向于pull-right，这使得这个class可以被其他需要靠右浮动的元素重用。而且一看名字就知道是靠右。

 >bootstrap就是这种风格。class代表名字的含义，利用给标签加多个class的方法实现其效果。