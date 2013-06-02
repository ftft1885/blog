title:jQuery-1
date:8:57 2013/6/2

突然要看jQuery了，原因有2

#### 原因1

在玩github的时候，我想fork一个repo，然后跟着它的commit一步一步学习。

我一开始想fork阿里前端的kissy库<https://github.com/kissyteam/kissy>

因为kissy的主页很清晰，而且在github上有专门的html，css，js书写规范，还有我喜欢的大牛在里面commit。最关键的是它的文档和注释有不少是中文的！

可惜我一看build，居然使用Ant构建的，一下子就痿了，Ant虽然是前端神器，不过我可不想在装个java。

后来看了下jQuery的，真棒，Grunt构建的。

#### 原因2

我最近一直觉得自己的简历写的丑，但是也改不了，虽然我表达能力不行，但简历终究不是作文，不需要太多文采。所以归根到底是自己实力不够，简历上的信息写的很虚。

我在简历上写熟悉linux，了解常用工具。结果面试官直接问我内核的知识，其实我就编译过几次内核，对内核完全不了解，我说的熟悉linux就是会用的意思。面试官说，那好，你知道ls吧，我大惊，面试官也把我想太弱了吧，我会这么多linux命令，你就问我个ls，面试官接着问，ls怎么让文件按时间显示。恩，然后我又跪了。这里不得不再记下ls的常见用法

	ll = ls -l
	ls -t [path] # 按时间排序
    ls -R [path] # 递归子目录
    ls -a [path] # 显示隐藏文件

总之我也在简历中写了熟悉原生js，同时也了解jQuery。既然写在里面，就应该对得起这句话。

首先这句话就是错误的，[@朴灵](http://weibo.com/shyvo)大大明确告诉我jQuery就是原生js，是哦，jQuery是一个dom操作库，并不像YUI那样是个框架。

我对jQuery用的极少的，因为jQuery找出来的dom对象不是原生的dom对象，必须用它自己的方法，用Nada大神的话来说：“这实在是非常的不爽”。后来我就没用jQuery了，不过我还是喜欢jQuery的api写法

这导致我一些东西，先会写个函数

	function $(s) {
		if ('querySelectorAll' in document) {
			return document.querySelectorAll(s);
		}
		...
	}
    
ajax也是。（后来发现别人写的真正的ajax库长达几百行。吓哭）

jQuery具体咋用还是要一步一步看着<https://github.com/jquery/jquery>慢慢学习~

跟着有名的库学习是很有必要的，在学校中，我们很少会学到构建工具，单元测试这些东西，看这些库，我们能知道怎样的目录分类是好的，注释该怎么写，文档是怎么生成的，以及构建工具的神奇，甚至还能知道`.travis.yml`是些啥玩意儿。

jQuery clone下来重达16.4M。而zip才300多k，可见里面的objects有多少了。。总之好大啦。

注意，在grunt构建之前，务必要`npm install`,这是nodejs中npm的命令，是把当前目录下的`package.json`中的devDependencies或者Dependencies中包含的库及其依赖库安装一遍。这些是grunt必须的。

同时还要注意，在window平台下，grunt命令需要在git bash中输入，因为grunt需要使用git命令，所以在cmd下输入是会出错的。

然后grunt就开始构建了，速度慢到爆。停在第一个上了，我还是先去吃饭把。

话说这篇博客就是在偶的markdown编辑器<http://chunpu.github.io/markdown/>上写的，markdownPad升级后不断提示文件被修改是否要reload（其实是它自己修改了自己，你说蠢不蠢）。总之那货是不能用啦，我在这上面先加入了ctrl+s就把文件加入本地存储中（就是所谓的html5 localStorage。），来满足自己的保存癖~，其他功能再说。上面的下载xx都是不能用的，我不会做这种。而且由于我改了line-height，导致只要用backspace删除就会出错位，亟待修复。

写完这段，jQuery已经构建好了。看到Done without errors就表示grunt通过。吃饭！
