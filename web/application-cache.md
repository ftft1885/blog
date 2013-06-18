title:Application Cache离线应用
date:20:04 2013/6/18

Application Cache是HTML5新功能，中文名叫离线应用。

常用于web应用，且不需要登录的那种。（比如我这个markdown编辑器）

##基本使用方法

    <html manifest="./hello.manifest">
    ...
    </html>

manifest填写的是manifest文件路径，manifest文件保存需要缓存的资源名字

##manifest文件格式

    CACHE MANIFEST
    #第一句话是必须写的，表示这是manifest缓存名单
    # 和shell一样的井号注释
    
    # 加上缓存的文件
    css/style.css
    index.html
    
    # 下面这句表示需要网络的资源    
    NETWORK:
    login.html
    submit.html
    
    # FALLBACK表示用户离线后转入的界面
    FALLBACK:
    offline.html   
    
# 看简单的例子

![](http://fimg.oss.aliyuncs.com/html/appcache-start.png)

从cache中获取内容(from cache)

![](http://fimg.oss.aliyuncs.com/html/appcache-get.png)

## 手动更新缓存

	window.applicationCache.update();
    
要注意的是如果你的manifest文件没有变，浏览器依然不会发起请求。

	CACHE MANIFEST
    # version 1
    xxx.html
    ...
    
    ====最常见的方法是改注释========
    
    CACHE MANIFEST
    # version 2
	xxx.html
    ...
    
### 查看是否在线

我们根本不需要去知道applicationCache.status.只需去检查是否客户是否联网即可

	if (navigator.onLine) {
    	window.applicationCache.update();
    }

但这句话依然是多余的，因为update成功与否，客户根本不会察觉，甚至是无法察觉。

即便在chrome的调试工具中（Network）中，也无法看到对manifest的请求。

但是在服务器就能清楚的看到浏览器对manifest的请求。

![](http://fimg.oss.aliyuncs.com/html/appcache-server.png)

成功更新缓存

![](http://fimg.oss.aliyuncs.com/html/appcache-success.png)



    


