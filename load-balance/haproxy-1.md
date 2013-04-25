haproxy-2
==================

Makefile
----------
上篇提到makefile唯一需要配置的参数是`TARGET`

	make TARGET=linux26

target是就是问的系统内核，选linux版本或者freeBSD等

这其实是都非常重要的。

可以从makefile中看到haproxy默认使用poll和trproxy

	USE_POLL   = implicit
	USE_TPROXY = implicit

到linux24e的时候，haproxy使用epoll，poll性能和select差不多。但是epoll是完爆poll的。

linux26使用了stardard epoll。所以基本上所有的TARGET都是linux26

后面还有一个TARGET=linux2628

针对更新版本的linux。里面有

	USE_LINUX_SPLICE= implicit
	USE_LINUX_TPROXY= implicit

splice是何物？在google上查了下

定义：

 >splice() 是　 Linux 　中与 mmap() 和　 sendfile() 类似的一种方法

效率：

 >有实验表明，利用这种方法将数据从一个磁盘传输到另一个磁盘会增加 30% 到 70% 的吞吐量，数据传输的过程中， CPU 的负载也会减少一半。

嗯，总之非常厉害。所以我们在TARGET后面填上linux2628

