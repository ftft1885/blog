shell脚本十分钟漫游
====

什么是shell？
---------
shell是外部接口，提供操作系统的接口，比如显示文件。移动文件之类的。

因此windows的cmd也是shell，而今天要漫游的是linux下的shell。

shell起源很早，1971年就有了。而linux百度百科上说1991年才有，也就是先有了shell后有了linux

shell有很多版本（50多种），但目前unix和linux下用的都是bash这个shell

上述资料都不重要，只需要知道像`cd somedir`,`ls`,`echo 'hi'`这样的命令都是shell命令就行了.

shell脚本是什么?
---------
shell脚本相当于windows下的批处理,它是一个文件,是多个shell命令的组合.脚本后缀一般是sh.

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
    
有时还会在文件第一行加上`#!/bin/sh`或者`#!/bin/bash`

`/bin/bash`是linux的bash执行目录,不写也是可以的,因为默认就是bash啦,perl或者其他语言就必须写了.


连续执行
------

    echo 'cat1'
    echo 'cat2'
    echo 'cat3'
    
或写在一行:

    echo 'cat1'; echo 'cat2'; echo 'cat3'
    
也就是说shell结尾是不需要分号的,分号相当于换行.换行相当于分号.shell连续执行命令

逗号没有分隔语句的功能.

分号的常见用法是

	$ cd ~/somedir;ls
    
你可能觉得我很无聊,说这干嘛

这里就要提到另一个常用连续执行语句

	make && make install
    
`&&`也是连续执行,那为什么没人写成`make;make install`

因为`&&`继续执行要求前面没有错误,也就是说`make install`必须要求make正确才会继续执行下去.

bash怎么知道前面有没有错误呢?这里有标准输出的问题,stdout是正确的结果,而如果是stderr就说明有错误.

有`&&`也就有`||`,也就是后面必须要前面执行出错才会执行.`||`的常用用法

	cat xxx && echo 'xxx is not exist'
    
意思就是:显示xxx的内容,如果不存在的话就显示xxx不存在.

试想一下这样一个简单的需求,用nodejs写的话要多麻烦...

`&&` 和 `&`
---------------
这俩个本来毫无关系,但是常看到有人写出`make & make install`这种东西来,实在要说下这俩的区别.

> 顺便提一下make的参数,如果make时间长的话可以使用`make -j 8`.意思是8线程同时make,电脑有n个线程就是`make -j n`.

**`&`表示把前面的放到后台一个进程中执行.**

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
	
可以看出所有的wget都是一起发出的,这个就感觉像nodejs中的异步一样,但实际上shell是通过后台新建进程来同时执行多发任务.

变量
------------
shell的变量只有一种,字符串,这个太棒了,没有其他类型真方便.

当然shell也是可以进行数据运算的,不过这个不是不重要.

### 变量声明

	a=2
	b=3

要注意的是等号中间不能有任何空格,空格属于后面讲的条件判断

### 使用变量

	echo 'a=$a'
	
就是前面加一个美元啦..

字符串连接
----------

	a='abc'
	b='def'
	c=$a$b"gh"
	echo $c # abcbcdgh

反义符
-------
用过perl的一定还是很熟悉.反义符就是执行其中的命令,**并把标准输出传到左边的变量中**.

	a=`curl baidu.com`
	echo $a

它会返回curl在shell中标准输出的所有字符,觉得很像grep.

注释
-------

### 单行注释

	# one line comment

### 块注释

	<<aa
	  this
	  is
	  block
	  comment
	aa

*perl是不是抄了很多shell啊..*



循环
-----------
循环也是shell中使用量很高的语句,因为shell主要是批处理嘛.

比如我需要不停的访问一个url,不停的调用curl语句,这时候用shell脚本的循环就可以直接解决了.

### for循环

	for (( i=1; i <=10; i++ )); do
	  echo hi
	done

可以总结出规律只要用到数字就是双括号.

### `for .. in ..`操作符

shell居然还有这么高级的写法.

	for i in {1..10}; do
	  echo $i
	done

`for in`还可以按空白字符把后面的字符串分割,空白字符有' ','\n','\t'等

	for i in `echo -e 'xx1\txx2\nxx3 xx4'`; do
	  echo "this is blank "$i
	done
	# print
	this is blank xx1
	this is blank xx2
	this is blank xx3
	this is blank xx4

还有不少用法,以后再补充

### while循环

	while ((1)); do
	  curl baidu.com
	done

最简单的写法,还是要注意,只要是数字就是`(())`

数组
--------

### 数组声明

	arr=(1 2 3 4)

### 输出数组

	echo ${arr[*]}

### 数组长度

	${#arr[*]}

### 修改元素

	arr[2]=2

### 移除元素

	unset arr[2]

### push元素

	arr[任何大于等于数组长度的整数]=2

### 数组分片

	arr=(1 2 3 4)
	echo ${arr[@]:1:3} # 2 3 4

### 数组替换

	arr=(1 2 3 99 2)
	echo ${arr[*]} # 1 2 3 99 2
	echo ${arr[@]/99/100} # 1 2 3 100 2

不会改变原数组

### 数组赋值

	arr=(1 2 3 99 2)
	arr2=${arr[@]/99/100}
	echo $arr2

可直接赋值

### 数组遍历

	for i in ${arr[*]}; do
	  echo $i
	done


函数
--------

最简单的函数:

	test(){
	  echo test
	}
	test # test

最简单的带参数函数

	hi(){
	  echo "hello $1"
	}
	hi 'shell' # hello shell


最简单的有return的函数

	add(){
	  return $(($1+$2))
	}
	add 3 2
	echo $? # 5

要点:

- 函数声明必须在函数使用之前

- 使用函数: `$(函数名 参数1 参数2)`

- 声明函数,参数不写在括号中,而是用`$1, $2, ..`表示

- 函数执行后的返回值只能通过`$?`获取

- 函数声明时可以加上function关键词,虽然没必要

	function foo(){
	}

> `$(($1+$2))`表示数学运算,数学运算格式是`$((...))`

### `$#`, `$@`, `$*`

	add(){
	  echo "args length = $#" # args length = 2
	  echo "args = $*" args = 3 2
	  echo "args = $@" args = 3 2
	  c=$(($1+$2))
	  return $c
	}
	add 3 2

`$#`取参数个数

`$*`和`$@`都表示所有参数,暂时没发现`$*`和`$@`有啥区别.


case语句
--------

case语句就是我们熟知的switch,只不过shell中没有switch,不过shell的case语句是我见过最爽的

	a='bbaaab'

	case $a in
	  3) echo 3;;
	  *aa*) echo *aa*;;
	  4) echo 4;;
	  *)
	  echo nothing;;
	
	esac

要点:

- 注意case的结束语句块的关键词是`esac`,也就是case倒过来,真蛋疼..

- 使用 `xx)`来匹配值, 使用`;;`双分号结束

- 可以使用正则!这就不多说了,什么`|`啊`*`啊用的飞起.


判断语句
-----------
如果说什么是程序最重要的功能,我会毫不犹豫的说循环和判断.

前面说的`||`和`&&`其实也是条件判断.

### 正规的if else

	sys=`uname -s`
	if [ $sys = 'Windows' ]
	then
	  echo 'Windows'
	elif [ $sys = 'Linux' ]
	then
	  echo 'Linux'
	else
	  echo 'unknown'
	fi

为了保持正常的缩进,习惯把then写在if同一行,也就是:

	if [ $a == $b ]; then
		echo
	fi

反正分号和换行是一样的嘛!

和一般语言的区别就是if后面是方括号`[]`,使用then代替大括号.

elif的拼写也是需要注意的.

if块结束符`fi`


### 字符串比较

方括号前后必须空一格,等号前后也必须空一格,如果不空格就成了`$sys='WIndows'`也就是前面说的赋值了.

字符串相等判断也可以用双等号表示

	[ $a = $b ]
	相当于
	[ $a == $b ]

我觉得写成双等号更加易读.

字符串比大小

	if [ $a \> $b ]
	if [ $a \< $b ]

要多个转义符啦

### 数值比较

数值比较还是很正常的,就多个括号而已

	if (( 2 > 1 )) # 大于
 	if (( 2 < 1 )) # 小于
	if (( 2 == 2 )) # 等于
	if (( 2 >= 1 )) # 大于等于
 	if (( 2 <= 1 )) # 小于等于
	if (( 2 != 2 )) # 不等于

### 字符串长度为0判断

字符串长度长度为0就是字符串为'';

	a=''
	
	if [ $a == '' ]; then
	  echo null
	fi

这样运行居然出错了.

	null.sh: line 3: [: ==: unary operator expected

这句话不知道是啥意思,但可以知道是少了什么东西(expected嘛)

由于$a本身是空,那上述脚本就变成

	a=''
	
	if [ == '' ]; then
	  echo null
	fi

这显然不能运行了.

修正做法:

	a=''
	
	if [ "$a" == '' ]; then
	  echo null
	fi

加上双引号就行了.

肯定有人要问了,为啥加单引号不行呢?试下单引号,发现脚本没有报错,但是结果是错的.

如果你是js程序员就一定会有这个疑问,js中单引号和双引号是一样的

如果你和我一样用过坑爹的perl,那这个就和perl一模一样.

`""`双引号中的内容如果有`$var`,那会被看成变量并且被替换成这个变量的值.

而在`''`单引号中,所有的值就是原来的值`$`符号就是美元符号

	a='xxx'
	echo '$a' # $a
	echo "$a" # xxx

但这个还是和perl中不一样的,比如换行,即便在双引号中使用`\n`依然没用

这时候要用到echo的`-e`命令

	echo -e 'xx\n xx\nxx'
	# print
	xx
	 xx
	xx

加上-e,不管在双引号还是单引号中都可以使用



待续...
------------























    
  



 




