title:git入门
date:2013/5/28

终于意识要认识git, 必须知道`.git`中保存的是啥了。

新建一个空目录，并git init，使用`du -sh .git`可以看到.git文件夹初始占了92k

进入.git查看目录结构

    4.0K    branches
    4.0K    config
    4.0K    description
    4.0K    HEAD
    40K     hooks
    8.0K    info
    12K     objects
    12K     refs

跟目录下只有3个文件，其他都是文件夹

config
-----------
config中只有[core]一栏，里面有四个看不懂的属性。

说到config就能想到git会用到的config的命令

    git config user.name --global myname

再打开config中多了一个user块，里面有user = myname

显然user就是那个section,config的时候必须要加上section

设置config的格式为

    git config <section>.<property> <value>

读取config的值

    git config [--get] <section>.<property>

对于foo.foo1.bar.bar1 这样多个key,[foo.foo1.bar]成为一个section,不过这不重要,取值依然靠git config foo.foo1.bar.bar1

#### 作用域选项

--global: 修改~/.gitconfig, 这是针对用户级的.

--system: 修改/etc/gitconfig, 针对整个系统的.

--local: 默认(不加就是--local),修改repo下的.git/gitconfig,针对单个repo

-f: 使用配置文件

#### section

有用的section有如下

+ core: 核心配置

+ add: 增加时错误选项,不重要

+ alias: 别名,重要,可以自己设置别名

    最常用的是把git status搞成svn那样..
    git config alias.st "status -s" # 一定要双引号才能表示在一起.

+ am: 不知道是啥

+ apply: 管理空格的,不重要

+ branch: 分支的选项

+ color: 颜色显示

+ commit: 是否需要commit status等

+ credential: 貌似跟https提交有关

+ diff: git diff相关

+ difftool: git diff选择的工具

...

总之还有一大堆啦.

description
------------
对repo的描述,目前完全没看出有啥用

HEAD
-----

    ref: refs/heads/master

不知有何巴意

文件是如何变化的
----------
由于刚才已经添加了一个文件readme.md,先看看.git的变化,可以看到毫无变化,再换个巨大的文件,55m的扔进去,依然没有区别.可以看出光是放文件进去是完全不会惊动git的(废话..)

试一下add

    git add -A

git反应了很长时间,由于有一个巨大的文件,看来add绝对有大动作.赶紧查看一下

    du -sh *

    4.0K    branches
    4.0K    config
    4.0K    description
    4.0K    HEAD
    40K     hooks
    4.0K    index
    8.0K    info
    54M     objects
    12K     refs

object一下子变这么大哦,而且大小近乎等于那个55m的大文件.基本可以肯定object把那个文件复制进去了.进入objects/

    du -sh *

    8.0K    d0
    54M     fc
    4.0K    info
    4.0K    pack

d0中有一个小文件,fc中有一个大文件.都是用完整性校验命名了

继续添加一个文件another,发现objects中又多了一个文件夹,依然是两个字母或数字的命名,内容是一坨乱码.

可以推论,git每个文件都对应一个文件夹吧..

修改another这个新增的文件,发现object中又多了一个文件夹,难道git是一次add N 个文件就加N个文件夹?这也太浪费空间了吧.不过目前看来是这样

试试commit

查看.git中文件变化 

    ll -t
    drwxr-xr-x  3 root root 4096 May 28 22:58 logs/
    drwxr-xr-x  8 root root 4096 May 28 22:58 ./
    -rw-r--r--  1 root root    9 May 28 22:58 COMMIT_EDITMSG
    drwxr-xr-x 12 root root 4096 May 28 22:58 objects/
    -rw-r--r--  1 root root  272 May 28 22:56 index
    drwxr-xr-x  3 root root 4096 May 28 22:55 ../

commit信息,log信息,object都在commit的时候变化了,而有个index的时间戳居然能随着`../`的时间戳变化,很显然index就是自动追随外面文件变化的最后时间,原理是啥呢?git能监控文件夹变化?好神奇啊,不知道怎么做到的.

不幸的是commit之后,文件夹依然这么多,没有任何整理,也就是每次add都会制造一个新的文件夹,修改大文件,比如那个55m的,经常add会造成大量的空间消耗.(那不是跟svn一样么..)

那这个2位字母或数字和一坨文件名是怎么来的呢,我们至少知道并不是一个文件夹肯定对应一个文件的

../blog/.git/objects/40
../blog/.git/objects/40/5a3fb99fc067fd54816a3c68a0eb8b85d5f0fe
../blog/.git/objects/40/05405844675b7f2f9cebf7baeeff7fc8ae9e62
../blog/.git/objects/40/46a7f8a817d979df3c883f17823afebe7de2a4

也有可能一个文件夹对应多个文件,文件夹名和文件名就是一个文件的sha1校验,可以通过cat-file这个git命令获取源文件

    git cat-file 60b69f2f471230a2df8e6dedb0d083e50445511c -p

使用-p参数获取全部信息

    tree f2c7c6ab6be805d5fa263036a8df664212fe8646
    author myname <ftft1885@outlook.com> 1369753091 +0800
    committer myname <ftft1885@outlook.com> 1369753091 +0800

    my first
 
这个正好是个commit的信息,

有些就只是文件内容

    root@AY1211110845135ce4797:~/blank# git cat-file  d0141680ee5324d51a558a0a48c8a867cbc6a47c -t
    blob
    root@AY1211110845135ce4797:~/blank# git cat-file  d0141680ee5324d51a558a0a48c8a867cbc6a47c -p
    this is test

普通文件就是blob类型.但是文件路径存在哪里呢?
