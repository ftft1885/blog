title:rss阅读器制作--2
date:23:13 2013/3/16

我发现rss阅读器难度果然超出想象。

这实在不能忍。

按常理来解析rss的xml是必然不行的。

因为几乎所有解析器都是一有错就结束。这根本没办法做阅读器。连基本的csdn和cnblog都没法解析。

不过有一个比较底层的解析器`sax`，不过这个太底层了。就是把标签发出来。连html的标签也会被搞出来，简直是无脑。

不过阅读器还是可以做的

rss的基本类型

	rss: {
		title: 'title',
		link: 'link',
		items: [
			{
				title: 'title',
				link: 'link',
				description: 'description'
			},
			{
				...
			}
		]
	}

只需遇到第一个title和link标签。认为它们就是博客总的title和link

以后的title和link都是单片文章的。

哦 rss数据必须要分段解析和分段发送。rss数据量之大已经不是我以前自己玩的`res.end(data)`这种一下就能解决的。。

-----过了一天----

要考虑网络极端恶劣的情况。

300kb的rss xml文件。假设网络很差，大概每10秒传5-10kb。

未完，搞完任务后搞这个。。




