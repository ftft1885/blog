title:css字体显示（font-face）
date:13:24 2013/3/13
tag:css

css字体显示。

几乎所有比较新潮的网站都会有前缀小符号。

这是如何实现的呢？

我们需要知道`@font-face`这个css值

[demo页面](/blog/css/font/index.html)

css的一般写法

	@font-face{
		font-family: 'uxi';
		src: url('uxi.ttf') format('truetype');
	}

这个只是自己设定了一种字体叫uxi。（uxi是一淘的字体库）

我们还需要设置一个使用这种字体的class

	.uxi{
		font-family: uxi;
		font-size: 40px;
	}

假设它就叫`.uxi`

使用方法

	<span class="uxi">A</span>
	//这样也可以的反正是ascii的编码
	<span class="uxi">&#65</span>

这样的写法字符是可以被选中的

通常网页的写法是写在伪类选择器中

我们新定义一个`.icon`的类
	.icon:before{
		font-family: uxi;
		font-size: 40px;
		content: "a";
	}

使用
	
	<span class="icon">它应该在我前面</span>

你还可以给icon设置颜色

	.icon:before{
		color: blue;
		font-family: uxi;
		font-size: 40px;
		content: "a";
	}

甚至是斜体，总之这个非常有趣，能让网页变得更活泼

！注意：当使用这个ttf的字库时，你的服务器需要支持`'.ttf': 'x-font-ttf'`这个mime type。

最后推荐几个字体库网站

[一淘UX图标字体库](http://ux.etao.com/fonts)

[Font-Awesome](http://fortawesome.github.com/Font-Awesome)

[http://fontello.com/](http://fontello.com/)
	