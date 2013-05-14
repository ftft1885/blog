title:vim学习-1
date:2013/5/10

经过上次被大大批评不能在简历中写精通，

我觉得除了http不精通之外，其他不少地方也没有资格写到简历中去。

比如说会使用vim。

一个技能的掌握程度莫过于三种：

1. 了解
2. 熟悉
3. 精通

了解vim的使用必须要会手写vim配置

首先要知道vimrc的位置

+ centos: /etc/vimrc

+ ubuntu: /etc/vim/vimrc

列出几个必要的配置(首先要知道一个双引号`"`注释)

+ syntax on " 高亮语法
+ set ts=2 " tab显示两个空格
+ set expandtab " 将tab实际改为空格,比如\t 变成 两个空格
+ set cindent " c语言风格的缩进.就是自动缩进
+ set shiftwidth=2 " 自动缩进以及 shift+>的缩进的长度
+ set nocp "set nocompatible的缩写
+ set nu "显示行号
+ set noswapfile "出错不保存
+ set backspace=indent,eol,start "设置backspace可以在insert下可以删除空白字符以及删到上一行去

不得不说里面的两个要点

1. set nocp
----------

 >就是set nocompatible的缩写,这个太重要了,这里的compatible指兼容vi的垃圾设定

 >那些设定并不是我们要的,如果不写这个set nocp

 >backspace将无法使用,set nu也会变的很丑,方向键在insert下也无法使用

 >撤销也只能撤销一次.等等等等,总之啥都可以没有,但set nocp必须要

提到使用方向键,肯定会有人说,你不专业啊,vim高手都只用hjkl,不用方向键的.

这个我就不敢苟同了,hjkl毫无逻辑,按起来很不舒服,键距又短,古书有云:用vim的jj短,其中就指责hjkl来移动光标

更何况hjkl在insert下就彻底没用了.为何不索性都用方向键呢?

2. 为什么ts,shiftwidth都设置为2?
-------------
这也是一个要点,有人喜欢用tab,有人用8个空格,有人用4个,还有奇葩的3个空格.

为什么非要2呢?也许你会觉得这是个人风格问题,无所谓啊.

但昨天面试中居然问到了这个问题.

原因很简单,如果一个程序足够大而且足够严谨,那必然会有大量的if else语句块嵌套,如果用4个或者4个以上空格来代表缩进的话,那代码就会看起来很斜.

因此google,以及很多开源项目明确规定缩进必须是两个空格

如果想给这些开源项目提交代码,一定要把风格及早改成两个空格

主题
----
本来没觉得vim配色不行,但自从出了sublime之后,就觉得vim有些落后

sublime默认monokai主题就相当不错.

vim当然也有这个主题

[vim-monokai](https://github.com/sickill/vim-monokai/raw/master/colors/Monokai.vim)

vim语法配色,插件这些一般都在/usr/share/vim/vim73中.

把这个主题放在colors文件夹中就行了

要持久使用monokai的配色依然需要配置vimrc文件

    colorscheme Monokai

注意,和syntax on一样,前面没有set的

等等,你说被我坑了?所有高亮都没了啊...

好吧,就是这句话,牛逼的颜色必须用256位色.一般人我不告诉他

    set t_Co=256

现在随便打开一段代码是不是跟sublime差不多了?


