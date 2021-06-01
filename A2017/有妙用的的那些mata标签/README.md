# 有妙用的那些meta标签

>导言：在接下来介绍各种神奇的meta标签之前，我必须先介绍一下相关的属性和概念。
  
meta标签有一个必要属性`content`，它一般是相关的文本信息，相当于属性的value值。  
它还有其他两个可选属性为`http-equiv`和`name`，前者会把mata标签代表的信息关联到http头部，后者meta标签传到的信息传达给浏览器相关，来描述自身。  
这两点非常重要，我们在看到一个不曾见过的`<meta>`标签时，通过先判断可选属性，再读取content属性，就可以知道大概的作用。

## 一、name属性的`<meta>`

1.这个标签做过移动端网页的同学都应该认得，它指定了视窗的大小。

```
<meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=0">
```

2. 当从主屏幕图标启动时，使网页以全屏模式运行；也隐藏浏览器顶部和底部的地址栏和组件栏。

```
<meta name="apple-mobile-web-app-capable" content="yes">
```

3.apple添加到主屏后的标题。

```
<meta name="apple-mobile-web-app-title" content="标题">
```
4.忽略数字自动识别为电话号码

```
<meta name="format-detection" content="telephone=no"> 
```

5.360浏览器强制调用chrome的webkit内核来解析网页。

```
<meta name="renderer" content="webkit">
```


## 二、http-equiv属性的`<meta>`

1.这个标签可以用来指定web站点只接受某些站点的来源和脚本图片等。这有助于防范跨站脚本攻击（XSS），可以详细可以看这里 [MDN的详细参考](https://developer.mozilla.org/zh-CN/docs/Web/Security/CSP/CSP_policy_directives)。  这个在腾讯等网站特别是带有评论功能等容易受到XSS攻击的网页有使用。

```
<meta http-equiv="Content-Security-Policy" content="script-src  *.qq.com  *.qpic.cn 'unsafe-eval' 'unsafe-inline';img-src  *.qq.com  *.qpic.cn">
```






