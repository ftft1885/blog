title:linux中的历史命令
date:12:45 2013/6/12

提到Linux中的历史命令,就会想到两个:

- history

- Ctrl+R

不过今天要讲的是`!`感叹号这个命令.

没有看错,`!`确实是linux命令中的关键词,但不是shell中关键词.

如果你看过[你可能不知道的Shell](http://coolshell.cn/articles/8619.html)这篇文章,那你也许会知道

	sudo !!
    
它的意思是以root身份执行上一条命令

同时,如果你尝试写过

	echo "hello!" > xxx.txt
    
那一定会发现它居然报错了!
    
	-bash: !": event not found
    
但是这种写法在shell脚本中并不会出错,所以我们说他并不属于shell的关键词

解决方法是

	echo "hello! " > xxx.txt
    
加上空格就是了.

*>>你这不扯淡嘛.听你说一堆就说这个玩意儿*

我们要探其本质!

这句话错误的原因就是因为`!`是linux的一个关键字

翻译成中文叫**历史命令查询**

也就是查询以前输过的命令啦.

具体用法
-------------

### `!!`上一条命令

    $ !!
    echo "hello ! "
    hello !
    
我前面输入过echo这个命令

### `!-n` 前面第n条命令

    $ !-2
    curl baidu.com
    <html>
    <meta http-equiv="refresh" content="0;url=http://www.baidu.com/">
    </html>

倒数第二次我执行了curl命令,可以发现其实`!!`和`!-1`是完全一样的

### `!$` 上一条命令的最后一个字符串

    $ curl baidu.com
    <html>
    <meta http-equiv="refresh" content="0;url=http://www.baidu.com/">
    </html>
    $ echo !$
    echo baidu.com
    baidu.com
    
### `!xx` 前面执行过的命令从头匹配

    $ !l
    ls
    file1	file2
    
    $ !cu
    curl baidu.com
    <html>
    <meta http-equiv="refresh" content="0;url=http://www.baidu.com/">
    </html>

    
总结
------
终于知道为啥

	echo "hello!" > xxx.txt
   
这样是错的了,因为它去找`!`后面匹配`"`的历史命令了..

总之感叹号还是挺好用哒~





