title:css选择器
data:2013/5/25

突然想记点css的东西,因为在我写css预处理的时候发现很多我不认识的写法..

当然最重要的还是我对css3完全不懂,甚至把`:before`说成是css3的选择器.实在无颜面对简历上熟悉css这几个字

css选择器有3种:css1,css2.1,css-level3.

css1有的选择器
-----------

+ E(标签选择器) 
+ E:link E:visited (未访问及访问过的超链接伪类选择器)(css1就有伪类了..)
+ E::first-line E::first-letter(必须承认我完全不知道这俩货)
+ E.class E#id
+ E F(子类选择器)

要注意的是两个冒号是css1和css2.1的写法,在css3中全部为一个冒号

:first-line
:first-letter
:before
:after
::selection(这啥玩意儿?)

这四个和伪类选择器不同,像`:active` `:hover` `:first`这些伪类选择器,他们选出的是一个dom元素.一个完整的dom元素,而这四个既可以用双冒号,又可以用单冒号的叫伪元素,标准的说法是`pseudo-element`

而`:hover`这种叫`pseudo-class`叫伪类,同时要注意的是我们不能叫它css伪类,而是说html伪类,因为这些html的dom元素因为class名字归位一类,而不是把css归为一类,我们只能说css伪类选择器.

css2.1选择器
----------
由于css2.1和css3界限不明显,分开来实在不好.

标签属性选择器
------
英文叫Attribute selector.

格式为

    E[attr]
    E[attr=value]
    E[attr~=value]
    ...

看到Attribute我们不禁警觉起来,想到WTP上那片文章Attribute与Property

<http://www.noahlu.com/blog/javascript-note/dom-attribute-property/>

我认为这个这两个东西区分是很简单的,attribute是xml上的东西,而property是js dom api上的东西.

文章中提到一点,比如在input中的checked和value改变,使用getAttribute取到的依然是初始值.

于是我非常无聊的试了下,还真是这样,就是说一个`input[checked]`的css,不会因为修改一个本来没有checked的改成checked而改变css.

这个有点学院派了,总之不要想着靠属性选择器动态改变css效果(除非用setAttribute?没试过不知道)

具体的说属性选择器吧

E[attr]:这个是最简单的,有这个元素就选中,E是可选的,经测试可以直接[attr]

E[attr=value]:最常用的值相等就选中

E[attr^=value],E[attr$=value]:这个也好理解,就像正则一样,一个从头匹配,另一个从后匹配.

E[attr*=value]:value是attr值的子字符串就选中

E[attr|=value]: hyphen-separated连接线匹配符

例子:[test|=aaa]

    <p test="aaa-aaa">aaa</p> // ok
    <p test="aaa-dfd">bbb</p> // ok
    <p test="aaa-dfd-bbb">bbb</p> // ok
    <p test="bbb-asas-aaa">bbb</p>
    <p test="asdberer-aaa">ccc</p>

可以看出连接线匹配符会匹配连接符第一个字符串,所以常用于lang的语言匹配(zh-CN,zh-TW)

当然用来分类也是不错哒.name以后就用`-`来分类好了.

[attr~=value]:空格匹配符,就跟class那样`class="class1 class2 class3"`有一个字符串一样就选中

通配符
-----
通配符就是`*`,这是IE6唯一支持的css2.1选择器,最常见通配符选择器的是在reset.css中

    * {margin: 0; padding: 0;}
 
不过这个并不推荐,我们要做的是尽量少的影响其他元素,而且这种匹配很费性能,建议把需要的标签一个一个写出来`html,body...`

其实我们无时不刻在用通配符

    .class相当于*.class
    #id相当于*#id

在w3上有个Note,说通配符不应该被省略,因为通配符可以减少歧义,使css更加有可读性.并给出了这个例子

    div :first-child // 子选择器
    div:first-child // 伪类选择器

如果我就是要上一种意思,而别人却以为我不懂css乱加空格,怎么办?

    div *:first-child
 
彻底让他们明白

要注意的是

    .box * {border: 3px solid blue}; 

能给.box所有子元素加上边框,但是自己是没有的,自己也要的话需要`.box, .box *{}`

关联选择器
---------
    E F
    E > F
    E + F
    E ~ F

要注意`E,F`不属于这类,`E,F`这种完全没有关系,纯属写起来简单归为一类.

`E F`: 很容易被初学者当成是并列的`,`,其实是子类选择器.即F在E里面

`E > F`: 跟上面的类似,也是子类选择器,只不过F必须是E的儿子,是孙子就不行.

`E ~ F`: 这里的意思是E,F必须有同一个爸爸,且F必须是E的弟弟.

`E + F`: 意思和上面的类似,E,F必须有同一个爸爸,但F必须紧跟着E生出来

可以看出`E > F`和`E + F`分别是`E F`和`E ~ F`的严格模式..

多元符号是可以有空格的,跟伪类选择器不同.








  


