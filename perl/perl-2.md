title:perl中的小坑和小窍门
date:2013/6/14

1. 块注释
--------
有作者表示perl没有块注释,我一开始在网上也没有找到块注释.

不过perl确实是有块注释的..爸爸们不要黑perl了.

    =anything
     this is 
     comment block
    =cut

2. 哪些值是false?
-----------
`undef, 0, '', '0'`

你没看错,`'0'`也居然是false...我去你大爷啊.这点上js做的就很完美.

3. perl中的散列
------
perl叫散列是对的,他根本不是hash..

    my %hash = (
      'key1' => 'val1',
      'key2',
      'key3' => 'val3'
    );

print keys %hash;

# output: key1key2val3

我本来觉得这个keys真的碉堡了,没想到就是取数组的奇数个,同理values取得是数组的偶数个

因此,`=>`是`,`的另一种写法,这个说法完全正确.

也就是说

    my %arr2 = (
      'key1', 'val1',
      'key2', '',
      'key3', 'val3'
    );

用`,`来分割数组,这样的效果是一样的..

当然你必须使用占位的东西来保证他的奇偶对应是key,value.不然又错啦.

value不能用undef来占位,即

    'key2' => undef,
    相当于
    'key2', undef,

这样是会警告的,不能用undef来初始化数组.我个人推荐用`''`空字符串占位

总之perl没有hash

cmp
------
cmp是字符串操作符,非常方便

用法: `$str1 cmp $str2`

返回值-1, 0, 1对应小于, 等于, 大于

比记那些个ne eq le ge好多了..

嵌套
-------

    my @arr = (
      1, 2, 3, (
          'sub1',
          'sub2'
        ), 
      4,5
    );
    # 123sub1sub245

虽然perl可以这么写,但是perl解释器根本不会鸟你它会去掉括号解释

提这个是为了说下面的

    my %hash = (
      1 => 2,
      3 => (
        'sub1' => 'sub2'
      ),
      4 => 5
    );
    # Use of uninitialized value $hash{"5"}
    # 125sub243sub1 

散列依然是被当成数组了,perl还假装自己是个hash..说没有初始化,事实上只要数组的个数在奇数个,他就会有这种警告.

引用
------
perl并不像python或者js那样有不可引用对象(如字符串,数字)和不能直接复制对象(如数组,hash)之分

也就是说在perl中

    my @arr = (1,2,3,4);
    my @arr2 = @arr;

perl确实是复制了这个arr.

那perl中如何引用呢? 使用这个操作符`=\`

    my @arr = (1,2,3,4);
    my $ref =\ @arr;

$ref是一个标量,保存的@arr的内存地址和类型.

类型可以通过
  
    ref $ref
    # ARRAY

ref()这个函数来获得

那如何从引用标量获得实际的东西呢?

    print @{$ref}

也就是用{xxx}花括号这个表达式.

当引用标量套了{},那就成了arr.

当然我们还是要在前面加上@,因为print @arr么.

同理修改@arr中的值

    ${$ref}[2] = 99;

对不懂perl的来说,看到这句话只想去死,懂了引用就非常好理解.

不过引用使用太频繁了,js和python默认`=`号就能引用,而且直接可以使用.

perl将其彻底区分,但还是有点麻烦的.

reference-2
------
继续深入reference(因为没有reference, perl就变得和js一样简单了..)

刚才说到引用标量找回它引用的东西是用花括号表达式.

其实这个花括号就两种情况

    @{$ref}
    %{$ref}

`@{$ref}`指ARRAY reference, 数组引用

`%{$ref}`值HASH reference, 哈希引用

对于不是array的引用去用`@{}`的话就会报错 not a array reference. hash同理

这就很莫名其妙了,既然你perl知道哪个是对哪个是错,为啥还要我去写`@`或者`%`,如果我并不知道数据类型呢?

总之相比python差远了,python的引用数据结构中直接保存了类型和名字.

    my $refArr = {1,2,3,4,5,6};

    my $refArr2 = {
      1 => 2,
      3 => 4,
      5 => 6
    };

    print %{$refArr}; # 345612

这种写法让新人摸不着头脑,其实就是直接定义一个匿名的hash,然后引用它而已,所以使用`{}`号来表示而不是`()`.

可以看出`$refArr`和`$refArr2`是完全一样的,这就是前面说的,`=>`就是`,`

当然`$refArr`这种写法也要偶数个才行,不然会有警告



reference-3: 匿名引用
---------
刚提到匿名引用,我觉得匿名引用太重要了,必须单独说

    my %hash = (
      'key1' => 'val1',
      'key2' => (
          'subkey'=> 'subval'
       )
    );

    print $hash{'key2'}; # subkey

    print $hash{'key2'}{'sub1'};
    # cannot use string ("subkey") as a HASH ref while "strict refs"

上次说到在圆括号中套圆括号是没用的,对于嵌套类型的复杂hash,我们并不能通过`$hash{'key2'}{'sub1'}`来获取subval.因为实际上`$hash{'key2'}`本身对应的就是'subkey'而不是那个子hash.

想要表达所想要的嵌套hash,必须使用匿名引用

    my %hash2 = (
      'key1' => 'val1',
      'key2' => {
        'subkey' => 'subval'
      }
    );

    print %hash2, "\n";
    # key1val1key2HASH(0x1e52fc8)

    print $hash2{'key2'}{'subkey'}, "\n";
    # subval

上面的hash2初始化和刚才hash初始化就一个括号的区别,hash2内部使用了花括号

花括号就是引用的意思,key2对应的值是一个引用标量
  
引用标量指向匿名hash:`'subkey' => 'subval'`

可是key1对应的明明是个引用啊,为何可以直接通过{'subkey'}取值呢?

如果按照之前的取出引用的值,就会写出这种可怕的代码..

    print %{$hash2{'key2'}}->{'subkey'}, "\n";
    # Using a hash as a reference is deprecated at bighash.pl line 30.
    # subval

    print $%{$hash2{'key2'}}{'subkey'}, "\n";
    # Use of uninitialized value in print at bighash.pl line 35.

第一个被不鼓励了,但是值是对的.第二个直接错误了.

那如果hash3本身是引用呢?

    my $hash3 = {
      'key1' => 'val1',
      'key2' => {
        'subkey' => 'subval'
      }
    };

    print $hash3->{'key2'}->{'subkey'}, "\n";
    # subval

我们不得不使用箭头来表示关系.

可以说虽然perl在语法上分开了引用和复制,但代价也是巨大的,这导致perl的代码是所有语言中最难懂的.


    $hash2{'key2'}{'subkey'},
    就是
    $hash2{'key2'}->{'subkey'},

HASH引用查值应当使用`->`

但为什么`$hash2{'key2'}{'subkey'}`也可以?

很可能perl解释器把{}{}自动当成{}->{}了(我瞎猜的)

匿名数组
-------

    my $arr = [1,2,3,4];

    print @{$arr}[1], "\n";
    # 2

匿名数组申明方式是用中括号`[]`

取引用值为`@{$arr}`

取属性值为`@{$arr}[x]`

果然是烦到爆啊..

所以建议先复制给一个真正的数组变量

    my $arr = [1,2,3,4];

    my @arr = @{$arr};

    print $arr[1], "\n";
    # 2

reference-引用总结
--------
在perl中

`=`必然是复制

`=\`才是引用.


Array函数
---------
待续吧。。

perl的吐槽
--------
perl出身是为了处理像表格那样的文字的，有强大的字符串函数库，虽然演变为语言，但本身却非常丑陋。

黑客与画家中的吐槽

> 许多黑客六个月后再读自己的程序，却发现根本看不懂它是怎么运行的。我认识好几个人，因为这种经历而发誓不再使用Perl语言。。

