title:路由表实现 
date:15:22 2013/6/24

一直在纠结web服务器路由处理的问题，设计起来实在是有点拙计。

看到express的路由，感觉很不错，首先一点，app.routes直接可以输出路由。

看到express输出的路由表，我就彻悟了，完全没必要去`设计`路由表了，直接按照express的做吧。

话说微博上看到一句话

> 创新是因为迫不得已。

这句话太对了，像express这样帅气的框架，根本不需要创新，我直接模仿的像点就行。更何况我本意就是学习express来着。。

路由表
-----

路由表分首先是一个hash，为啥是hash而不是数组呢？因为通过HTTP方法定义的路由，不会因为有定义的顺序，我们只需要在方法内部定义数组来显示顺序即可。

    console.log(app.routes)

    { get: 
       [ { path: '/',
           method: 'get',
           callbacks: [Object],
           keys: [],
           regexp: /^\/\/?$/i },
       { path: '/user/:id',
           method: 'get',
           callbacks: [Object],
           keys: [{ name: 'id', optional: false }],
           regexp: /^\/user\/(?:([^\/]+?))\/?$/i } ],
    delete: 
       [ { path: '/user/:id',
           method: 'delete',
           callbacks: [Object],
           keys: [Object],
           regexp: /^\/user\/(?:([^\/]+?))\/?$/i } ] }
           
但这也有问题，那就是express提供了all这个东西,all属于全HTTP VERB，显然不再试用这种路由表。 express直接强x了这个all到路由表，也就是把所有的http verb都加了进去。什么patch subscribe写一大堆

好的办法是把all当成hash的key放进去。可是这又有问题了，all可能会有好几个，我们知道hash的key肯定是唯一的。

产生这种矛盾是因为all一般用来处理rest api这样的请求，先看请求uri，再校对http method对不对，如果http method不对就返回wrong http method。

也就是说all是先看uri再看method，而传统web界面是先method再看uri的。

在按http method的分组中，all确实只能在顺序数组中，比如

    app.get('/a', ...)
    app.all('/all', ...)
    app.get('/b', ...)
    
    // print
    get: ['/a', '/all', '/b']
    
一起用的时候，依然是按照这样的顺序。

但是它本该是这样的：

    app.get('/a', ...)
    app.all('/all', ...)
    app.get('/b', ...)
    
    // print
    [get, '/a']->[all, '/all']->[get, '/b']
    
这才是本来的匹配链。

匹配路径设计
-------

匹配路径是一个生成正则的过程，我本来很反对这个，因为如果我简简单单要匹配一个'/index'为啥要生成个正则呢？

但路径中提供两个特殊字符: `:`, `*`.冒号代表定位符，`*`就是通配符啦。这两个用的非常多，尤其是通配符，因此生成正则也无不可。

生成正则的顺序如下（我自己瞎想的）

- `*`转成(.*), 注意，这样会导致`*`也会被定位。（注意req.params是Array的实例，直接push就行了，由于Array又是Object的实例，可以直接给key）

- 匹配定位符：
  
    :id ==> (?:([^\/])+?)
    
> 看懂这段，正则得像我一样牛逼才行，蛤蛤，首先第一个就是`(?:)`，意思是不是定位括号。后面的问号是最小匹配。其他就很简单啦。

> 转义： 由于我们无法通过字面量来构建正则，不得不使用标准的构造函数实例化正则对象。而字符串本身也认识`\`这个转义符，因此需要对`\`处理成`\\`,同样，有`"`的话要转成'\"'

- 最后，在外面套上一层`^       \/?$`, 其中`^, $`代表头尾匹配，i表示ignore忽略大小写，`\/?`是啥呢？就是既可以后面有`/`也可以后面没有`/`的意思啦。（express真是细心）

> 顺道说下，极力不推荐使用任何相对路径，因为末尾有`/`和没有`/`的相对路径差一等级。

函数设计
--------
我觉得根本没必要像express那样搞这么复杂嘛。

只要把生成的正则放在stack中就可以了。。

    