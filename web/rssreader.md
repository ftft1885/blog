title:rss阅读器制作
date:9:20 2013/3/14

惊闻google reader要关闭，程序猿爱动手，故及早开始尝试自制rss订阅器

####难点1： 找到rss地址

engadget：

	<link href="http://cn.engadget.com/rss.xml" title="RSS 2.0" type="application/rss+xml" rel="alternate" />

不过。有些是有两个的，例如这个

	<link rel="alternate" type="application/rss+xml" title="RSS 2.0 - All Posts" href="http://1.ftft1885.sinaapp.com/?feed=rss2" />
	<link rel="alternate" type="application/rss+xml" title="RSS 2.0 - All Comments" href="http://1.ftft1885.sinaapp.com/?feed=comments-rss2" />

还有这样的相对地址

	<link rel='alternate' type='application/rss+xml' title='atom 1.0' href='/feed' />

啊 总之搞到这个地址需要很纠结的字符串判断。

获取到xml后用xml2js转成json就行了

第二天我发现有些rss并不藏在html结构中，而直接是`/rss`或`/feed`，比如[知乎](http://zhihu.com)

####难点2: 如何从一坨json中找到posts(博客)的内容

先来看wordpress的

	{ rss:
		{  '$':{ version: '2.0',
				'xmlns:content': 'http://purl.org/rss/1.0/modules/content/',
				'xmlns:wfw': 'http://wellformedweb.org/CommentAPI/',
				'xmlns:dc': 'http://purl.org/dc/elements/1.1/',
				'xmlns:atom': 'http://www.w3.org/2005/Atom',
				'xmlns:sy': 'http://purl.org/rss/1.0/modules/syndication/',
				'xmlns:slash': 'http://purl.org/rss/1.0/modules/slash/' 
			},
			channel: [ [Object] ]
		}
	}

再来看新浪的

	{ rss:
 	  { '$': { version: '2.0', 'xmlns:sns': 'http://blog.sina.com.cn/sns' },
	     channel: [ [Object] ] } }


farbox的

	{ feed:
   		{ '$': { xmlns: 'http://www.w3.org/2005/Atom' },
		     title: [ 'FarBox Blog' ],
		     link: [ [Object], [Object] ],
		     id: [ 'blog.farbox.com' ],
		     updated: [ '2013-02-17T17:11:44Z' ],
		     entry: [ [Object], [Object], [Object], [Object], [Object], [Object] ] 
		}
	 }

我们看到两种rss标准，RSS version2.0居多。

获取它们订阅的路径是`rss.channel[0].item`

判断语句

	xml.rss && 
	xml.rss['$'] && 
	xml.rss['$'].version == '2.0'

可惜不是所有的都用了2.0的标准

菜鸟程序员最爱的cnblogs就是Atom的标准。哦对了，cnblog还用了重定向（what fuck）

Atom的获取路径是`feed.entry`,判断语句

	xml.feed && 
	xml.feed['$'] &&
	xml.feed['$'].xmlns &&
	xml.feed['$'].xmlns.toLowerCase().indexOf('atom') !== -1

####难点3：处理各种标准的数据。就是主要获取link href还有post内容。

这个就不多说了，依然是各种判断。

总之一个api能返回这三条就算是个正常的rss api。

但显然这个是最难的，甚至有可能永远无法完美解决此问题。

####4. 如何做一个RSS订阅网站

这里完全是菜鸟自己瞎想，无任何根据

+ 账号基本数据类型：
	
		uid : {
			name: 'name',
			psw: 'psw',
			lists: []
		}

+ 博客数据类型

	var blogs = {
		bid:{
			title : 'title',
			link : 'link',
			preview: 'preview',
			posts: []
		}
	}
	
 >bid应该还是link。。

 >preview也是重要的，因为不可能去存储posts这样大量的数据，但是preview很小可以存储。posts尽量从网上抓取再返回。

+ 会有几个页面？

 >本菜觉得3个页面足以

 >1. 主页，显示所有订阅的title

 >2. detail页面，显示detail。。

 >3. 注册页面或timeline？不过我至今不知道rss的timeline怎么写

正在我思考detail页面的路径时，我发现上面的bid应该是title。link当路径多丑啊，而且link显示在主页上也没用

要注意的是xml通常长度很大。如果接收完在发回去，会长时间占着连接，容易timeout。所以要做到边解析边发送。这个实在是难爆了。整个结构都被破坏了。至今想不出优雅的解决方法


