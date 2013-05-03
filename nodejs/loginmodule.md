title:登录模块制作
date:2013/4/2

登录模块制作

我每次都避开登录模块这部分，因为我不会做这个。

但是这次由于要写后台控制，不能不做个登录模块。

我本来是在程序里挤一块写的。又丑又难以使用。

我对http不算太了解，只知道用form提交很难解析，要用到其他专门解析form的模块。

所以准备写个可以复用的登陆模块，为以后做论坛准备。

其实主要原因是看了昨天的js编码规范，模块之间必须松耦合。。

还是跟以前一样，我从没看过任何其他正常网站的实现方法，纯粹自己瞎想。

首先这个0.0.1版本不考虑数据库。

我希望模块是用起来是这样的

先考虑使用场景。

使用者引导用户到一个login的url，比如localhost/login

这个时候，login模块完全代理这些url的接受和反馈

最终重定向到指定页面。如localhost。

期间login模块做的就是认证，set cookie，如果有cookie就直接重定向。还有之后要做的注册等等。

我期望的使用模块方式是

	var Login = require('xxxlogin');

	var userManage = new Login({
					timeout:24, // cookie expires
					key:'abc'	// key to encrypt
					redirect_uri: '/home'
				  });
	
	if(pathname.indexOf('/login') === 0){ 
		// 托管所有前缀为login的url
		userManage.check(req,res,'/home');
	}

	或者

	if(!userManage.hasVerified(req.headers.cookie)){ 

		// 托管所有是应该登录，但是cookie不对的url，
		userManage.check(req,res);
	}
	
所以模块的api应该是

	userManage.check(req,res)

这主要的就是里面的cookie了。这个模块是想让用户完全不考虑 `登录` 这个部分，cookie认证不能让用户来定义

cookie至少需要多少的属性呢？

 >1. uid

 >2. token // 相当于一个临时通行证吧

最少两个属性就能完成认证。但是很显然这俩cookie被别人复制走，自己设置cookie，别人也能免认证登陆

不过我实在没想出别的办法，只能用上自带的Expires属性。可以选择带上命名空间前缀，以免和自己想定义的重复

登录步骤

1. 如果有token和uid的cookie，

 >+ 检查服务器上是否保存了该uid的session。

 >+ 检查expires是否过期

 >+ 计算md5，对比token

 >>+ 如正常则通过并延长过期时间。

 >>+ 如错误则重新登录

2. 如果没有token

 >+ 重新登录

3. 没有uid

 >+ 重新登录

几个表单提交的url

1. /login/

2. /xxx/signup

3. /

###希望提供的API

 >getUser() // 返回json，该User的各种信息

 >listUsers() // 返回数组,所有Users

 >addUser(user) // 添加一个User，如果只是管理页面的话只需添加一个或几个管理员就行了。

 >hasVerified(cookie) // 一个请求头，是否能通过认证。

###构造函数的参数

 >title // 名字
 
 >description // 信息 

 >theme // 登录界面主题

 >redirect // 认证结束重定向地址

 >key // session计算token的key

 >timeout // token失效时间

 >url // 托管url，默认/login

###构造函数安全检查

 >重定向地址是否无限死循环

表单提交用form还是ajax

 >form

 >1. 重定向可以方便设置cookie，但是我不知道怎样在当前页面显示错误。

 >ajax

 >1. 快速认证。但是要用用js来控制url跳转

	window.location.href = "/home";

应该注意的是ajax返回的时候貌似也能设置cookie

Set-Cookie: uid=xxxx; path=/; expires=xxxxx; httpOnly

一个该有的流程

1. 使用者让模块托管 /login

 >1 用户访问/loginxxx

 >2 检查是否cookie正确

 >>+ 正确则重定向至/home ——》 结束

 >>+ 错误则返回login.html文件

 >3 用户提交ajax post 表单

 >>+ 账户,密码通过，服务器保存数据,返回定义的回调uri，返回set-cookie.注意此处不能返回302,而是200，通过js跳转href。	

 >>+ 账户，密码不通过，返回错误类型	"ERROR：xxxx"

###如何登出（logout）

思考了下还是只能用ajax，指定一个uri(如url+'/logout')

好吧，ajax传的set-cookie貌似不能清除cookie

试下重定向。是了，只有重定向可以logout，并且决不能少了'path=/',本人不知道为什么。。

抄了个css表单效果，好开心啊，为什么抄别人这么爽？

我发现外国人都是用sign in , sign out , sign up这三个词表示的。我决定也用这个。反正基本做完了，剩下一些小打小闹的测试--和至今不知原理的token生成。。（告诉我就是uid和时间的md5吧！！）

9:39 2013/4/1

思考n久，没有想出token的算法。决定不折腾这个了，把token想成临时密码就行。token就是uid+expires.getTime()+key的md5.

user对象中存储expires（绝对时间，这是必须的，因为要计算收到请求和expires的差，超出则作废，token也是可以直接存在对象中里面的。也可以不存）

 