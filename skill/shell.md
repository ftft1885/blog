shell脚本十分钟漫游
====

什么是shell？
---------
shell是外部接口，提供操作系统的接口，比如显示文件。移动文件之类的。

因此windows的cmd也是shell，而今天要漫游的是linux下的shell。

shell起源很早，1971年就有了。而linux百度百科上说1991年才有，也就是先有了shell后有了linux

shell有很多版本（50多种），但目前unix和linux下用的都是bash这个shell

当然，上述资料都不重要，只需要知道像`cd somedir`,`ls`,`echo 'hi'`这样的命令都是shell命令就行了.

shell脚本是什么?
---------
shell脚本相当于windows下的批处理,它是一个文件,是多个shell命令的组合.后缀一般是sh.

Hello World
--------
一篇语言教程,三页不出现如何输出hello world,我就不想看了.

hi.sh:

    echo 'hello, word'
    
嗯,就是我们常用的echo命令,简单的不行.不像其他语言要好几行才能有个hello world

###执行

	$ sh hi.sh
    或者
    $ bash hi.sh
    
更推荐bash啦.sh直接输入会进入编辑模式,bash就像perl nodejs python那样啦.

我们可以通过

	$ bash --version
    
查看版本.

一般sh都是改成可执行文件

    $ chmod +x hi.sh
    $ ./hi.sh
    
有时还会在文件第一行加上`#!/bin/sh`

`/bin/sh`是linux的bash执行目录,不写也是可以的,因为默认就是bash啦,perl或者其他语言就必须写了.


连续执行
------
    echo 'cat1'
    echo 'cat2'
    echo 'cat3'
    
写在一行:

    echo 'cat1'; echo 'cat2'; echo 'cat3'
    
也就是说shell结尾是不需要分号的,分号相当于换行.换行相当于分号.shell连续执行命令

逗号没有分隔语句的功能.

分号的常见用法是

	$ cd ~/somedir;ls
    
你可能觉得我很无聊,说这干嘛

这里就要说道另一个常用连续执行语句

	make && make install
    
`&&`也是连续执行,那为什么没人写成`make;make install`

因为`&&`继续执行要求前面没有错误,也就是说`make install`必须要求make正确才会继续执行下去.

bash怎么知道前面有没有错误呢?这里有标准输出的问题,stdout是正确的结果,而如果是stderr就说明有错误.

有`&&`也就有`||`,也就是后面必须要前面执行出错才会执行.`||`的常用用法

	cat xxx && echo 'xxx is not exist'
    
意思就是:显示xxx的内容,如果不存在的化就显示xxx不存在.

试想一下这样一个需求,用nodejs写的要多麻烦...

`&&` 和 `&`
---------------
这俩个本来毫无关系,但是常看到有人把`make & make install`这种东西来,实在要说下这俩的区别.

`&`表示把前面的放到后台一个进程中执行.

hi.sh:


    a='https://a248.e.akamai.net/assets.github.com/assets/github2-dbfecd24131ff912b4e9fe4d5a365661e862a5c5.css';
    
    b='https://a248.e.akamai.net/assets.github.com/assets/github-28cb64109a7ebb60276b297a5459cd080aa82add.css';
    
    start=`date +%S`
    
    echo $start
    
    wget $a & wget $b # wget $a && wget $b
    
    end=`date +%S`
    
    echo $start,$end


这段程序表示wget两个github上的css,访问github的原因是速度比较慢.

记录起始和结束时间

用`&`花了两秒,用`&&`花了四秒

即便是4个`wget`


    2013-06-11 14:16:18 (237 KB/s) - `github2-dbfecd24131ff912b4e9fe4d5a365661e862a5c5.css.9.1' saved [195930]
    
        [   <=>                                 ] 195,930      237K/s   in 0.8s
    
    2013-06-11 14:16:18 (237 KB/s) - `github2-dbfecd24131ff912b4e9fe4d5a365661e862a5c5.css.9' saved [195930]
    
    17,18
        [    <=>                                ] 256,841      255K/s   in 1.0s
    
    2013-06-11 14:16:18 (255 KB/s) - `github-28cb64109a7ebb60276b297a5459cd080aa82add.css.9' saved [256841]
    
        [   <=>                                 ] 195,930      197K/s   in 1.0s
    
    2013-06-11 14:16:18 (197 KB/s) - `github2-dbfecd24131ff912b4e9fe4d5a365661e862a5c5.css.9.2' saved [195930]
	
可以看出所有的wget都是一起发出的,这个就感觉像nodejs中的异步一样,但实际上shell是通过后台新建进程来进行多任务同时进行的.

变量
------------
shell的变量只有一种,字符串,这个太棒了,没有其他类型真方便.

当然shell也是可以进行数据运算的,不过这个很不重要.

### 变量声明

	a=2
	b=3

要注意的是等号中间不能有任何空格,也许是shell出的早,没想到现代人会有加空格这种奇怪的癖好吧..

### 使用变量

	echo 'a=$a'
	
就是前面加一个美元啦..

循环
-----------
循环也是shell中使用量很高的语句,因为shell主要是批处理嘛.

比如我需要不停的访问一个url,不停的调用curl语句,这时候用shell脚本的循环就可以直接解决了.

待续...

判断语句
-----------
如果说什么是程序最重要的功能,我会毫不犹豫的说循环和判断.

这是因为数学是程序的超集,程序只用了数学中的数学归纳法和条件判断以及二进制(这是我自己认为的).

前面说的`||`和`&&`其实也是条件判断.









    
  



 





