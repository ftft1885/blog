title: Linux终端神器tmux
date: 7:10 2013/7/10

前天一个师弟分享了神器tmux,我觉得实在强大,并且解决了困扰我多年的问题,现在分享一下tmux的简单使用方法.

tmux是一个托管linux本身终端的东西,他对我来说最大的好处在于ssh的时候如果断网或者inactive了,重连后依然可以接入断开前的界面.

同时tmux又非常擅长分屏操作,看一下tmux的工作界面

![](http://fimg.oss.aliyuncs.com/skill/tmux-1.jpg)

安装
----
tmux安装可以直接用apt-get install tmux安装, 而且有man

基本概念
------
学习tmux一定要先知道他的基本概念

tmux中的快捷键都在Ctrl+b后激活进入快捷键模式

大概就是说tmux可以有多个session, session可以包含多个window,window可以包含多个pane,下面一一解释.(client不在本文讨论范围)

### pane

pane是tmux中最小的终端,中文意思是框框.

看如下示意图,显示了一个window中的3个pane(快捷键:q)

![](http://fimg.oss.aliyuncs.com/skill/tmux-2.jpg)

也就是说pane是在window下的子集.

pane的基本增删换快捷键

- 右边新建: %

- 左边新建: "

- 退出: x

- 切换: o(上下左右也可以)

### window

window就是窗口,window包含pane,同时window也可以有多个

window基本快捷键

- 新建: c

- 退出: &

- 切换: 向前切换p,向后切换n

- 选择: w, 如图

![](http://fimg.oss.aliyuncs.com/skill/tmux-3.jpg)

### session

session指会话,一个session可以包含多个window.

session的基本操作

- 新建: 直接输入tmux

- 退出: d(脱离但不是kill)

- 切换session: s

- 列出全部session: tmux ls

![](http://fimg.oss.aliyuncs.com/skill/tmux-4.jpg)

通过`tmux attach -t [x]` 来进入指定的[x]session

### 总结

显然这些快捷键根本难以记住.其实我们只需要记住两个快捷键

#### 1. `Ctrl+b -> ?`

`?`快捷键就是列出所有快捷键,查询即可

![](http://fimg.oss.aliyuncs.com/skill/tmux-5.jpg)

#### 2. 退出

window,pane,session退出都不一样,烦都烦死了,怎么办呢?直接Ctrl+D就行了!当然exit命令也行,这是最最关键的.

tmux进阶
-----
有人说,咦,我的界面跟你不一样啊,花花绿绿感觉好丑.嗯,下面说的就是美化

第一步是修改tmux的配置,系统级配置在`/etc/.tmux.conf`,用户级在`~/.tmux.conf`.

配置如下

	#set -g default-terminal "screen-256color"
	#set -g status-bg color235
	#set -g status-fg color136
	
	#### COLOUR (Solarized 256)
	
	# default statusbar colors
	set-option -g status-bg colour235 #base02
	set-option -g status-fg colour136 #yellow
	set-option -g status-attr default
	
	# default window title colors
	set-window-option -g window-status-fg colour244 #base0
	set-window-option -g window-status-bg default
	#set-window-option -g window-status-attr dim
	
	# active window title colors
	set-window-option -g window-status-current-fg colour166 #orange
	set-window-option -g window-status-current-bg default
	#set-window-option -g window-status-current-attr bright
	
	# pane border
	set-option -g pane-border-fg colour235 #base02
	set-option -g pane-active-border-fg colour240 #base01
	
	# message text
	set-option -g message-bg colour235 #base02
	set-option -g message-fg colour166 #orange
	
	# pane number display
	set-option -g display-panes-active-colour colour33 #blue
	set-option -g display-panes-colour colour166 #orange
	
	# clock
	set-window-option -g clock-mode-colour colour64 #green

第二步是进入tmux, 命令变了

	tmux -2

是不是超好看呀~



