title:编码的初步认识
tag:编码
date:2013/2/19

###前言

一直对编码耿耿于怀

因为gbk和utf8傻傻分不清楚

还有ansi和unicode这些听都没听过的东西捣乱

只能说脑中就是一团浆糊

上次学farbox自制类似farbox的东西，在windows上已经得以运行

偏偏部署到linux上出现文件名乱码。

一口老血吐出，旅游也难以心安。

于是回到家第一件事就想把编码搞清楚

###背景

我目前知道的关于编码的几个名词：

+ utf8
+ gbk
+ ANSI
+ Unicode
+ ascii

其中ansi，utf8，unicode都是在记事本中另存为看到的

而ascii是听说的，gbk又是很多中文网站用的编码

至于他们的关系是否并列，我尚且不知

首先我先取了一段字符`123CH中文`其中又有数字又有英文又有中文

并且用记事本保存为ansi unicode utf8格式的3个文件

用notepad++一一打开并查看编码。

可以发现unicode对应的编码是UCS-2 Little Endian,而utf8和ansi都是各自对应。

上网一查便可知道unicode只是一个统一标准。而utf8和UCS-2 Little Endian才是unicode的表现编码

当然如果你没有notepad++。我更建议用chrome打开这些文件

我们可以清楚的看到它门分为3种编码

+ unicode(UTF-8)  ---utf8
+ unicode(UTF-16LE)   ---unicode
+ 中文简体(gbk)---ansi

windows确实误人子弟。记事本这么分类，不知道的还以为是并列关系呢

事实上ansi在简体中文系统下就是指gbk

而unicode和utf8则都是unicode统一标准下的编码（记事本坑爹啊）。

###读出buffer

分别读出ansi，utf8，unicode这三个的`123CH中文`的buffer

	<Buffer 31 32 33 43 48 d6 d0 ce c4>
	<Buffer ef bb bf 31 32 33 43 48 e4 b8 ad e6 96 87>
	<Buffer ff fe 31 00 32 00 33 00 43 00 48 00 2d 4e 87 65>

我们可以看出完全不一样。此文只说gbk（ansi）和utf8的对比

事实上我们用notepad++会发现记事本的utf8是有bom的utf8.就是前面有`ef bb bf`这三个字符来说明此文件是utf8的

我们改成utf8无bom后再看buffer

	<Buffer 31 32 33 43 48 d6 d0 ce c4>
	<Buffer 31 32 33 43 48 e4 b8 ad e6 96 87>

发现还是有规律可循的

`31 32 33`显然就是对应的`1,2,3`

`43 48`对应的就是`C H`

不同的是后面的两个中文，我们终于明白为什么中文这么苦了。英文数字转来转去都一样么。。

不过我们可以看出`中文`
>gbk 
>>1个中文对应2对数字`d6 d0 ce c4`

>utf8
>>1个中文对应3对数字`e4 b8 ad e6 96 87`

所以说gbk占用容量小，做网页考虑的细的话确实比utf8省空间。

但是gbk太节省了导致不能定义完其他国家字符。而utf8则毫无压力。

所以从通用性上utf8完胜

有一些可以分辨编码的软件包，一般以chardet为名（就是char detect的意思吧）

nodejs中有jschardet，我试了一下这三文件

	<Buffer 31 32 33 43 48 d6 d0 ce c4>
	<Buffer 31 32 33 43 48 e4 b8 ad e6 96 87>
	<Buffer ff fe 31 00 32 00 33 00 43 00 48 00 2d 4e 87 65>
	{ encoding: 'GB2312', confidence: 0.99 }
	{ encoding: 'windows-1252', confidence: 0.95 }
	{ encoding: 'UTF-16LE', confidence: 1 }

第二个他说是windows1252页。是微软非常高端的东西，不知道和utf8甚关系。

###转换编码

这个就很简单了，用上面的chardet检查出是gbk的话，用iconv转化成utf8，nodejs没有自带iconv，我们得用npm下载iconv-lite，嗯，强烈建议这个，iconv那个居然还要编译而且很难编译成功

	var str = iconv.decode('gbk buffer','gbk');//转换gbk到utf8用法。

	source:
	gbk:
	<Buffer 31 32 33 43 48 d6 d0 ce c4>
	utf8:
	<Buffer 31 32 33 43 48 e4 b8 ad e6 96 87>
	
	what code?
	{ encoding: 'GB2312', confidence: 0.99 }
	{ encoding: 'windows-1252', confidence: 0.95 }
	
	change gbk to utf8
	result:
	gbk:
	<Buffer 31 32 33 43 48 e4 b8 ad e6 96 87>
	utf8:
	<Buffer 31 32 33 43 48 e4 b8 ad e6 96 87>
	


	

