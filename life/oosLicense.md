date: 19:59 2013/7/23
title: 开源许可证介绍


GitHub上的绝大多数项目都没有附加任何许可证条款。众所周知，GitHub是当今开源软件的集散地，但是其中只有14.9%的代码库（169万中的21.9万）在顶级目录中包含了许可证授权条款。

换而言之，GitHub上的大多数代码即不是开源软件，注意，没有开源许可证则说明仅仅允许私人使用。github在No License中写的很清楚

> You retain all rights and do not permit distribution, reproduction, or derivative works. You may grant some rights in cases where you publish your source code to a site that requires accepting terms of service. For example, publishing to GitHub requires you allow others to view and fork your code.

也就是说你保留所有权利，不允许分发或者复制等

各种开源许可证的图

![](http://fimg.oss.aliyuncs.com/life/ossl2.jpg)

![](http://fimg.oss.aliyuncs.com/life/ossl1.jpg)

![](http://fimg.oss.aliyuncs.com/life/ossl3.jpg)



MIT
---
非常宽松的许可协议，就是说你什么都可以干，但我不负责质量。

相当于是免责声明

使用该许可证的项目：jQuery、Rails、Express


BSD
----
也是宽松的协议，但比起MIT，BSD不允许软件的衍生版用原作者名字促销，BSD依然是一个免责声明。BSD和MIT差异很小。

MIT和BSD给了我们几乎所有的权利

Javascript常用BSD许可协议。因为javascript库很多，替代品也多。作者要做的仅仅是免责而已。

Apache v2
---------
Apache v2的许可很长，比BSD和MIT要严格不少，需要保留全部的原始版权，如果修改，则必须要加上主要的修改通知。

这是原文中对于复制与分发的三个must

> You must give any other recipients of the Work or Derivative Works a copy of
this License; and
You must cause any modified files to carry prominent notices stating that You
changed the files; and
You must retain, in the Source form of any Derivative Works that You distribute,
all copyright, patent, trademark, and attribution notices from the Source form
of the Work, excluding those notices that do not pertain to any part of the
Derivative Works;

Apache是具有免责的法律效益的，而且有专利保护。（许可协议第三条Grant of Patent License.）

使用该许可证的项目：Apache、SVN和NuGet


GPL v2 | GPL v3 (GNU General Public License)
--------
GPL是常用许可协议中最严格的了。GPL是copyleft协议，copyleft不多说，是根据copyright造出来的词。

GPL最最重要的一条就是GPL的衍生品必须也是GPL协议。也就是说以GPL协议发布的软件，其后继版本将都是GPL，要注意的是Linux就是GPL，因此遵循Apache v2许可证的Android违背了GPL协议。衍生不可变更协议也同样使得使用GPL的软件必须开源（使用的那部分）。

> But when you
distribute the same sections as part of a whole which is a work based
on the Program, the distribution of the whole must be on the terms of
this License, whose permissions for other licensees extend to the
entire whole, and thus to each and every part regardless of who wrote it

这句话极大的限制了自由，偶英语不好，但看起来貌似还说这个许可要延伸到整个软件。

v3和v2的区别在于v3增加了对于硬件的限制。

使用该许可证的项目：Linux、Git、LVS


LGPL (GNU Lesser General Public License)
------
GPL过于严格，于是GNU发布了LGPL这个限制较少的许可证。

不过LGPL同样要求后继产品继承LGPL协议。因此不允许封闭代码。

LGPL以前叫Libary General Public License，如果你使用一个LGPL下的库， 你需要遵循LGPL，如果仅仅是连接这个库，则不需要遵循LGPL。

LGPL和GPL最大的不同是LGPL允许在私有软件上使用它，而GPL只允许在自由软件上使用。




Licensing:WTFPL
---------

最弱的许可证。		

		DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
		Version 2, December 2004
		
		Copyright (C) 2004 Sam Hocevar
		14 rue de Plaisance, 75014 Paris, France
		Everyone is permitted to copy and distribute verbatim or modified
		copies of this license document, and changing it is allowed as long
		as the name is changed.
		
		DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
		TERMS AND CONDITIONS FOR COPYING, DISTRIBUTION AND MODIFICATION
		
		0. You just DO WHAT THE FUCK YOU WANT TO.

<https://fedoraproject.org/wiki/Licensing:WTFPL?rd=Licensing/WTFPL>



这么多开源许可证怎么选择呢？

github来帮你，妈妈再也不用担心我选许可证了

<http://choosealicense.com/>




违反开源许可证的例子
------

D-Link德国违反GPLv3.

暴风影音，qq播放器，射手违反ffmpeg（GPL许可证）

Android使用Apache v2违反GPL许可。

商业协议和开源许可证并存
--------
mysql既是GPL，又有商业协议，这并不冲突。普通用户使用并不需要付钱， 厂商以此获利则需要遵循商业协议。

多个开源协议兼容
---------
MIT, Apache v2兼容GPL。

jQuery之前就移除GPL只用MIT

之前的许可证部分

	* Copyright (c) 2012 jQuery Foundation and other contributors
	* Dual licensed under the MIT or GPL Version 2 licenses.
	* http://jquery.org/license

现在已经变成`MIT-LICENSE.txt`了


GPL是更好的开源许可
---------
看起来放弃版权或者使用BSD许可，显的更无私，很大程度上确实如此，但有时候却会相反。

相比BSD， 或者放弃版权。GPL要严格许多，至少它会限制后继版本。但这样做其实是非常好的。因为如果开发者自己或者被外力强制修改版权甚至是闭源（比如所在公司被收购），GPL许可的软件不会有什么影响，因为它的后继版本由于强制是GPL。我们可以继续使用他的后继版本。而BSD或其他许可的软件，很有可能被私有化。之前所有的努力都变成给别人打工。

github也说了， 如果`I care about sharing improvements.`，那就应该选GPL。







