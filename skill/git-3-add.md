title:git命令详细--git add
date:20:27 2013/5/31

先记一个查看文件数量的命令（与本文无关，查看objects文件数量变化的）

	ls .git/objects -lR | grep '^-'|wc -l 
	# 递归查找文件夹。

git add是最常用的命令之一,不提出来单独讲简直对不起git.

不仅在新加文件中使用,也要在修改文件中

最常用的场景
-----------
	
	git add file1 file2 ...
	例如
	git add cats/cat1.txt cats/cat2.txt

	A  cats/cat1.txt
	A  cats/cat2.txt
	?? cats/cat3.txt

cat1.txt和 cat2.txt前缀变为A(add)了.

使用通配符
------------

	git add '*.txt'
    
    git status -s
    # 输出
    A  cats/cat1.txt
    A  cats/cat2.txt
    A  cats/cat3.txt
    
这里要注意github强调必须要引号,但实际操作中不加引号效果是一样的.
文件夹的话`git add cats/` 当然也是可以的

添加所有文件
----------
添加所有修改的文件有n种

    git add -u
    git add -A
    git add *
    git add . // 同上
    
git add本身的意思是把选中的文件放入index中,index是给commit看的,commit根据index来建立模式

要搞懂这几个add操作的区别，必须先要搞清楚git对文件的分类

新建一个cat4.txt，删除cat1.txt, 修改cat2.txt

	git st
	D cats/cat1.txt
	M cats/cat2.txt
	?? cats/cat4.txt

可以看到git识别的很正确。

	git add -i
	           staged     unstaged path
	  1:    unchanged        +0/-1 cats/cat1.txt
	  2:    unchanged        +1/-1 cats/cat2.txt


提到git add -i,就不得不先暂停-u, -A的探讨。会用git add -i远胜一切。

git add -i
----------
git add -i不会修改任何东西，它的作用仅仅是查看。这个命令会进入子命令模式，有六个子命令，进入时默认为status，而一般情况下看stage就够了。

在修改文件后且不使用任何add时：

	git add -i
	           staged     unstaged path
	  1:    unchanged        +0/-1 cats/cat1.txt
	  2:    unchanged        +1/-1 cats/cat2.txt

子命令显示3个参数:staged, unstaged, path(unstaged 和 path挤一起了)

#### staged和unstaged

staged指已经索引（index）中的，上面说过index中的就是等待commit提交的文件。由于还没有add操作，所以index中没有任何文件，也就是没有任何文件在stage上。unstaged就是指还没add到stage上的文件，
`+0/-1`指增加0行，去掉1行，同理`+1/-1`指增加1行，去掉1行（修改了一行）。

#### git add *
	git add *
	           staged     unstaged path
	  1:    unchanged        +0/-1 cats/cat1.txt
	  2:        +1/-1      nothing cats/cat2.txt
	  3:        +1/-0      nothing cats/cat4.txt

注意add * 就是添加全部了，和`git add .`是一样的。

可以看到多出来一个我们新建的`cats/cat4.txt`，且cat2和cat4的修改都到staged上了，而删除的cat1还在unstaged中，因为`git add .`和`git add *`都属于`git add <file>`,只把修改的，或新建的这两种文件加入到stage中。

这个时候我再修改cat2

	git add -i
	           staged     unstaged path
	  1:    unchanged        +0/-1 cats/cat1.txt
	  2:        +1/-1        +2/-0 cats/cat2.txt
	  3:        +1/-0      nothing cats/cat4.txt

发现cat2也有unstaged了。但没有到stage中去。

总结： `git add *`或`git add .`并不会把文件删除这种动作添加到stage中去。

#### git add -u

	git add -i
	           staged     unstaged path
	  1:        +0/-1      nothing cats/cat1.txt
	  2:        +3/-1      nothing cats/cat2.txt

一眼就看出居然少了个我们新建的`cat4.txt`，

看一下`git help add`

> Only match <filepattern> against already tracked files in the index
rather than the working tree. That means that it will never stage
new files

帮助中说的很清楚，`-u`不会把任何新加进来的文件放入stage。

#### git add -A
	git add -A
	           staged     unstaged path
	  1:        +0/-1      nothing cats/cat1.txt
	  2:        +3/-1      nothing cats/cat2.txt
	  3:        +1/-0      nothing cats/cat4.txt
这正是我们所要的！git终于把所有的修改都放到stage上了，`-A`就是指`--all`，他会把删掉的文件，新建的文件，修改的文件都放入stage(不就是所有的改动么。。注意移动就是删除+新建)。

总结
--------
如果经常有删除新建这些动作，显然`git add -A`是最最常用的git add命令。同时，如果你不知道add了多少，那经常使用`git add -i`查看改动也是非常必要的！

最后祝纸爷今日脱团成功！