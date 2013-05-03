title:让浏览器变身编辑器
tag:browser
date:2013/1/30

#让浏览器变身编辑器

[数据URI的格式](http://www.nczonline.net/blog/2009/10/27/data-uris-explained/)使得浏览器用这个url可以变成编辑器

	:::javascript
	data:text/html,<html contenteditable>

于是有大神改造了一下[https://gist.github.com/4666256#file-ruby-notepad-bookmarklet](https://gist.github.com/4666256#file-ruby-notepad-bookmarklet)。超级高亮编辑器出现

	:::javascript
	data:text/html, <style type="text/css">#e{position:absolute;top:0;right:0;bottom:0;left:0;}</style><div id="e"></div><script src="http://d1n0x3qji82z53.cloudfront.net/src-min-noconflict/ace.js" type="text/javascript" charset="utf-8"></script><script>var e=ace.edit("e");e.setTheme("ace/theme/monokai");e.getSession().setMode("ace/mode/javascript");</script>

javascript高亮编辑器，实在是太帅了。

你可以修改`ace/mode/javascript`如`ace/mode/python`变成其他高亮