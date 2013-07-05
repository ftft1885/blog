title:学习Erlang不是一个分分钟的事
date:19:45 2013/7/4

我本来觉得学习一门语言是分分钟的事，这次项目要求用Erlang做，我有点诧异。但也开始学习起来。

更让我诧异的是接触过近10种语言的我在学习Erlang的路上举步维艰。

###Erlang的优势

学习一门语言之前，我都会去看一下它的软文，也就是广告文。因为这会极大的提高学习的性趣。比如Lisp，看完《黑客与画家》这本Lisp广告后你还不想学Lisp请来找我。

Erlang的广告文也不少，比如这个[全世界只有我们Erlang程序员是正确的](http://www.aqee.net/erlang-solving-the-wrong-problem/)

从上文可以看出Erlang的一些特性和优点

1.并发

并发一直是Erlang的宣传点,性能是Apache的xx倍, 并发数xxx.这些都是Erlang的文章中经常看到的.

同样需要注意的是Erlang支持的是并发而不是并行.因此看到并发我们就可以猜测Erlang不是线程模型.也就是说Erlang也和Nodejs一样是单线程或者无线程的 ,他们都通过子进程来利用多核.

Erlang的进程是自己的进程,而非操作系统概念上的进程.这些进程很是轻量级的,几乎没有性能消耗.

2.集群

Erlang在一些老文章中提到的优点都已经不再是优势,但是,Erlang在集群上的表现依然是无人能比的.其中Erlang自带的分布式数据库mnesia直接解决了集群的通信和数据同步问题,无需redis等工具的辅助.

###Erlang概述

Erlang完全是从Prolog语言上改造出来.它是一个彻底的**函数式语言**.

对于Erlang,人们有一段出名的描述: Erlang可以把简单的事变得复杂,也能把复杂的事变得简单.

这句话意思是Erlang不适合小型程序的开发,但适合用于复杂集群这些框架的开发.

下面都是今天看着很多文章总结的.手头没有现成的书,可能有错见谅

###Hello world

还是像以前那样,我们需要讲一下hello world.

非常不幸的是Erlang并不在各Linux发行版中内置,而Erlang丑陋的官网上也找不到安装的方法.

所幸安装还是比较正统的. 也就是解压,configure, make..

Erlang程序在运行上很像java,java需要先编译成jvm的字节码`.class`文件,而Erlang也需要先编译成`.beam`的不知道是什么的文件.

Erlang程序的后缀是`.erl`.进入erlang自己的shell也是通过erl命令.

    1> io:format("hello world~n"). % 不要忘了句号!
    hello world
    ok

其中`io:format`就类似print console.log echo等输出函数.而`~n`是换行符`\n`的意思.

可以看出format是`io`库中的一个函数,Erlang用`:`表示库和函数的关系.

同时也能看出`%`是行注释.Erlang没有块注释. 对了,perl也没有块注释.在我那篇说perl的小坑说perl有块注释,那个方法是错误的.

###基本类型

1.Number 

可以做基本的数学运算.

2.Atom 

原子类型, 例: a, a1, aaa.

看上去像没有引号的字符串,原子是小写字母开头,后面可以跟各种东西的字面量.

所谓字面量就是说字面是啥就是啥,它不是字符串,不会有字符串那样有字符串操作(比如相加,取值等).

true和false都是原子类型

    2> Flag = 2 > 1.
    true % true也是原子类型
    3> Flag2 = 1 < 0.
    false % false也是


3.变量 

变量是大写字母为开头,如A, A1, Bbb.

Erlang的变量足以让人骂娘,因为这个变量并不可变.

也就是说A1 = 2.赋值完后,A1不能再被赋值,A1一直是2.

如果A1被赋值后继续给A1赋值: A1 = 3.会报错说不匹配.至于为啥错误是不匹配还要到后面说.

总之变量是不能重复赋值的.Erlang里面自己也把赋值叫bound(绑定).这也带来很多问题,变量名浪费(无法重复使用).最基本一个,我们无法i++(各种循环).

Erlang说这样是为了防止锁,难道改变变量不是原子操作（不可分割的操作）?

变量可以用`f(XX)`解绑,`f()`是解绑所有变量。

4.列表

列表类似数组,或者就是数组,像其他脚本语言那样也是多类型的

例如: [1,2,aa, bb].

这里有个要点,就是字符串也属于列表.就是说"Hello"这个看似像字符串的东西也是一个列表.

因为"Hello"相当于[72,101,108,108,111]. 字符串存储为由 ASCII 字符值组成的列表.

    25> [$H,$e,$l,$l,$o].
    "Hello"
    
用$直接表示ASCII的值.

Erlang不支持i++,却反而把列表玩的很转,Erlang中有lists这个库,提供各种各样的方法,后面再说.

5.结构体

结构体是一个复杂数据类型,可以包含前面说的数字,原子,列表等

结构体用大括号包起来.常见的例子是{A, B}, {1,2}

结构体可以批量赋值,比如`{A,B} = {1,2}.`.这时候A就是1,B是2.

还可以更复杂的结构,如{A,B,{A1,B2}},

    1> {A,B,{A1,B1}} = {1,2,{3,4}}.
    {1,2,{3,4}}
    2> A.
    1
    3> A1.
    3
    
结构体主要就是用来按结构匹配,传值.

不过这种结构匹配要求完全结构完全一样.那对于我们不想要的值怎么办呢?

比如{name, {val1,val2}} 我们只想要val1和val2怎么办?

Erlang不允许{,{Val1,Val2}}这样匹配,而是必须使用占位符`_`下划线来占位

    3> {_,{Val1,Val2}} = {1,{2,3}}.
    {1,{2,3}}
    4> Val1.
    2
    
在实际中占位符经常被使用.

哦,结构体还有另一个名字:元祖

6.还有很多数据类型,比如fun,pid等等.这些超出了本文的范围.

### 复杂的`=`

`=`等于号的作用很多,首先是赋值

    A = 1. % A还未被绑定,于是被赋值为1
    
    A = 2. % A已经被绑定,于是转为匹配,比较发现不相等,报错.
    ** exception error: no match of right hand side value 2
    
    A = 1. % A已经被绑定,转为匹配,发现相等,返回1(A是啥返回啥)
    
模式匹配

    16> Person = {person, {name, "Agent Smith"}, {profession, "Killing programs"}}.
    {person,{name,"Agent Smith"},
            {profession,"Killing programs"}}
            
对于这样的一个复杂的结构体,我们想取出变量Person中的两个列表值"Agent Smith"和"Killing programs"该怎么办呢?

    17> {person, {name, Name},{profession, Profession}} = Person.
    {person,{name,"Agent Smith"},
            {profession,"Killing programs"}}
    18> Name.
    "Agent Smith"
    19> Profession.
    "Killing programs"
    
模式匹配还是比较方便的..当然也有很大的问题,视力杀手!

###列表的操作

1.头尾分隔符`|`

    21> [A1 | B1] = [1,2,3,4,5].
    [1,2,3,4,5]
    22> A1.
    1
    23> B1.
    [2,3,4,5]
    
    26> [A2, B2 | C2] = [1,2,3,4,5].
    [1,2,3,4,5]
    27> A2.
    1
    28> B2.
    2
    29> C2.
    [3,4,5]
    
在分隔符前面,列表像结构体那样依次匹配,分隔符后面一个变量匹配后面剩余内容(数组).这样可以做出很多数组的递归操作

2.列表加法和减法

    1> [1,2] ++ [3,4].
    [1,2,3,4]
    2> "hello" ++ "world".
    "helloworld"
    
由于字符串就是列表,所以字符串相加的方法和数组相加的方法一模一样.

想起吐槽php用`.`连接字符串我就不好意思,毕竟还有Erlang这么奇葩的存在.

    4> [1,2,3,4] -- [1,4].
    [2,3]
    5> "hello world" -- "world".
    "hel ol"
    
字符串相减看起来很奇怪,以为是乱匹配的删的.我也不懂,有时候减还会出错.

3.lists模块 这个不在本文讨论范围

###编译

前面都是在erlang自己的shell中运行的.那如何正常编译呢?

先写出一个最简单的程序`hi.erl`， `%`是注释

    -module(hi). % 定义模块名字叫hi,必须和文件名一样(多此一举)
    -export([hi/0]). 
    % 定义输出的函数叫hi,参数是0个.用列表是因为可以输出多个函数
    % 比如-export([hi/0, hello/2]). 这样的
    
    hi() -> % 函数内容
      io:format("hello"). 

第一种是在Erlang的shell中编译

    1> c(hi). % 编译hi.erl, c函数应该是compile的意思
    {ok,hi}  % 此处在当前路径生成一个hi.beam
    2> hi:hi(). % 执行hi模块中的hi函数.名字相同是我故意的..
    hellook % ok是Erlang的输出

第二种是使用erlc编译

    $ erlc hi.erl % 编译生成hi.beam
    $ erl -noshell -s hi hi -s init stop % 这段我也看不懂
    hello
    
###语句

1.case

    -module(casetest).
    -export([test/1]).

    test(Animal) ->
      case Animal of
        cat->bigcat;
        panda->bigpanda;
        dog->bigdog
      end.
 
这就是case的大概结构,可以看出Erlang的case相当于其他语言的switch.这里又多了分号这个符号,后面会专门讲Erlang中的分隔符

编译运行

    1> casetest:test(cat).
    bigcat
    2> casetest:test(xxx).
    ** exception error: no case clause matching xxx
         in function  casetest:test/1 (casetest.erl, line 5)
    3>

case中没有指定xxx,在这里报错了.Erlang提供了类似default这样的匹配.就是前面说过的占位符`_`.

    test(Animal) ->
      case Animal of
        cat->bigcat;
        panda->bigpanda;
        dog->bigdog;
        _->unkwownAnimal % default
      end.
      
    1> casetest:test(xx).
    unkwownAnimal

2.if语句

    -module(iftest).
    -export([test/1]).
    
    test(Num) ->
      if
        Num > 0 ->
          big;
        Num < 0 ->
          small
       end.

发现和case差不多,只是前面输入的变成一个条件语句.编译运行

    1> iftest:test(2).
    big
    2> iftest:test(-1).
    small
    3> iftest:test(0).
    ** exception error: no true branch found when evaluating an if expression
         in function  iftest:test/1 (iftest.erl, line 5)
         
在使用0为参数的时候又报错了.因为是我们没有指派满足0的条件语句.错误信息告诉我们没有true branch.

    test(Num) ->
      if
        Num > 0 ->
          big;
        Num < 0 ->
          small;
        true ->  
        % 加上true分支,这里换成2>1也是可以的.但不能只用一个1
          zero
       end.   
    
    1> iftest:test(0).
    zero

### Erlang中的逗号 分号 句号

学习Erlang的时候常常因为搞不清它的逗号分号句号而沮丧.再加上Erlang不像Nodejs那样有起眼的文档(反正我没有找到).符号居然成了我们前进路上的障碍,这必须要消灭它.

逗号`,`表示表达式之间的分隔符,类似于c风格语言的分号`;`

分号`;`表示相同结构语句之间的分隔.这里得相同结构几乎就是指case if中链式匹配的结构.

句号`.`表示语句或者函数的结束.

先看一个简单的例子

    % 使用逗号分隔
    1> A1 = 1, A2 = 2.
    2 返回2,也就是A2的值
    
    % 使用句号分隔
    2> B1 = 1. B2 = 2.
    1 % 先返回1
    3> B2 = 2.
    2 % 再返回2
    
这是因为每个语句都有返回值,而逗号分隔的表达式组,返回最后那个表达式的值.

句号则相当于输入两次.

    -module(iftest).
    -export([test/1, getmax/2]).
    
    test(Num) ->
      if
        Num > 0 ->
          big;  % 分号,后面还有相同结构
        Num < 0 ->
          small;
        2>1 ->
          zero % 最后一个相同结构不需要分号
       end. % 函数结束,用句号
    
    getmax(Num1, Num2) -> % 逗号分隔参数
      if
        Num1 > Num2 ->
          Num1; % 分号,后面还有相同结构
        Num2 < Num1 ->
          Max = Num1, Max;
          % 逗号分隔表达式,依次对表达式求值后返回最后一个表达式
        true ->
          Num2 % 最后袷相同结构不需要分号
  		end. % 函数结束,用句号
        
总结:

- 逗号: 告诉编译器,后面肯定还有表达式呐!

- 分号: 后面肯定还有和我一样结构的语句呢!

- 句号: 我结束了,后面可能还有函数哦!

### rebar

即便到这儿,我依然不能看懂任何一个简单的项目.因为这些项目都用到了[rebar](https://github.com/basho/rebar)这个Erlang项目构建工具.

下面讲一下使用rebar的hello world.

    $ mkdir app
    $ cd app/
    $ rebar create-app appid=hello
    ==> app (create-app)
    Writing src/hello.app.src
    Writing src/hello_app.erl
    Writing src/hello_sup.erl
    $ vim src/hello_app.erl
    
这里我们在hello_app.erl中加入一句输出hello的话

    -module(hello_app).
    
    -behaviour(application).
    
    %% Application callbacks
    -export([start/2, stop/1]).
    
    %% ===================================================================
    %% Application callbacks
    %% ===================================================================
    
    start(_StartType, _StartArgs) ->
        io:format("hello~n"), % 随便加一行
        hello_sup:start_link().
    
    stop(_State) ->
        ok.

使用rebar编译全部

    $ rebar compile
    ==> app (compile)
    Compiled src/hello_app.erl
    Compiled src/hello_sup.erl
    $ erl -sname lqg -pa ebin/ -pa deps/*/ebin/
    Erlang R16B01 (erts-5.10.2) [source] [64-bit] [async-threads:10] [hipe] [kernel-poll:false]
    
    Eshell V5.10.2  (abort with ^G)
    (lqg@ft)1> application:start(hello). % 运行自己的hello程序
    hello % 成功输出..
    ok

Erlang初步入门先到这儿~是不是感觉举步维艰呐.

   















