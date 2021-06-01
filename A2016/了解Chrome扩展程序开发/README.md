## 了解Chrome扩展程序开发

> 首先，我尝试来用简单几句话描述一下Chrome扩展程序：

Chrome扩展主要用于对浏览器功能的增强，它强调与浏览器相结合。比如Chrome扩展可以在浏览器的工具栏和地址栏中显示图标，它可以更改用户当前浏览的网页中的内容，也可以更改浏览器代理服务器的设置等等。

#### 0. 认识Chrome扩展程序 - 最重要的入口 manifest.json

Chrome扩展是一系列文件的集合，这些文件包括HTML文件、CSS样式文件、JavaScript脚本文件、图片等静态文件以及manifest.json。[清单文件信息](https://crxdoc-zh.appspot.com/extensions/manifest)

扩展被安装后，Chrome就会读取扩展中的manifest.json文件。这个文件的文件名固定为manifest.json，内容是按照一定格式描述的扩展相关信息，如扩展名称、版本、更新地址、请求的权限、扩展的UI界面入口等等。这样Chrome就可以知道在浏览器中如何呈现这个扩展，以及这个扩展如何同用户进行交互。

通过Chrome扩展我们可以对用户当前浏览的页面进行操作，实际上就是对用户当前浏览页面的DOM进行操作。通过Manifest中的content_scripts属性可以指定将哪些脚本何时注入到哪些页面中，当用户访问这些页面后，相应脚本即可自动运行，从而对页面DOM进行操作。

值得一提的是，Google允许Chrome扩展应用不必受限于跨域限制。跨域指的是JavaScript通过XMLHttpRequest请求数据时，调用JavaScript的页面所在的域和被请求页面的域不一致。对于网站来说，浏览器出于安全考虑是不允许跨域。这个规则如果同样限制Chrome扩展应用，就会使其能力大打折扣，所以Google允许Chrome扩展应用不必受限于跨域限制。但出于安全考虑，需要在Manifest的permissions属性中声明需要跨域的权限。

#### 1. 操作用户正在浏览的页面

通过Chrome扩展我们可以对用户当前浏览的页面进行操作，实际上就是对用户当前浏览页面的DOM进行操作。通过Manifest中的content_scripts属性可以指定将哪些脚本何时注入到哪些页面中，当用户访问这些页面后，相应脚本即可自动运行，从而对页面DOM进行操作。

content_scripts很像Userscript，它就是将指定的脚本文件插入到符合规则的特定页面中，从而使插入的脚本可以对页面的DOM进行操作。

#### 2. 常驻后台

有时我们希望扩展不仅在用户主动发起时（如开启特定页面或点击扩展图标等）才运行，而是希望扩展自动运行并常驻后台来实现一些特定的功能，比如实时提示未读邮件数量、后台播放音乐等等。

Chrome允许扩展应用在后台常驻一个页面以实现这样的功能。在一些典型的扩展中，UI页面，如popup页面或者options页面，在需要更新一些状态时，会向后台页面请求数据，而当后台页面检测到状态发生改变时，也会通知UI界面刷新。后台页面与UI页面可以相互通信.

在Manifest中指定background域可以使扩展常驻后台。background可以包含三种属性，分别是scripts、page和persistent。如果指定了scripts属性，则Chrome会在扩展启动时自动创建一个包含所有指定脚本的页面；如果指定了page属性，则Chrome会将指定的HTML文件作为后台页面运行。通常我们只需要使用scripts属性即可，除非在后台页面中需要构建特殊的HTML——但一般情况下后台页面的HTML我们是看不到的。persistent属性定义了常驻后台的方式——当其值为true时，表示扩展将一直在后台运行，无论其是否正在工作；当其值为false时，表示扩展在后台按需运行，这就是Chrome后来提出的Event Page。Event Page可以有效减小扩展对内存的消耗，如非必要，请将persistent设置为false。persistent的默认值为true。


#### 3. 带选项页面的扩展

"options_page": "options.html"

一般来说做一些选择设置然后本地localstorage的工作

#### 4. 扩展页面间的通信

Chrome提供了4个有关扩展页面间相互通信的接口，分别是runtime.sendMessage、runtime.onMessage、runtime.connect和runtime.onConnect。

请注意，Chrome提供的大部分API是不支持在content_scripts中运行的，但runtime.sendMessage和runtime.onMessage可以在content_scripts中运行，所以扩展的其他页面也可以同content_scripts相互通信。

runtime.sendMessage完整的方法为：

```
chrome.runtime.sendMessage(extensionId, message, options, callback)
```

其中extensionId为所发送消息的目标扩展，如果不指定这个值，则默认为发起此消息的扩展本身；message为要发送的内容，类型随意，内容随意，比如可以是'Hello'，也可以是{action: 'play'}、2013和['Jim', 'Tom', 'Kate']等等；

runtime.onMessage完整的方法为：

```
chrome.runtime.onMessage.addListener(callback)
```

此处的callback为必选参数，为回调函数。callback接收到的参数有三个，分别是message、sender和sendResponse，即消息内容、消息发送者相关信息和相应函数。其中sender对象包含4个属性，分别是tab、id、url和tlsChannelId，tab是发起消息的标签

#### 5. Browser Actions

1.图标

```
"browser_action": {
    "default_icon": {
        "19": "images/icon19.png",
        "38": "images/icon38.png"
    }
}

chrome.browserAction.setIcon(details, callback) // details的类型为对象，可以包含三个属性，分别是imageData、path和tabId。
```

2.Popup页面

Popup页面提供了一个简单便捷的UI接口。新窗口会使用户反感，而popup页面的设计更像是浏览器的一部分，但popup页面并不适用于所有情况。由于其在关闭后，就相当于用户关闭了相应的标签页。当用户再次打开这个页面时，所有的DOM和js空间变量都将被重新创建。

- 使用带有滚动条的DIV容器。
- 设计一个更好的滚动条样式。
- 考虑屏蔽右键菜单。
- 使用外部引用的脚本。
值得注意的是Chrome不允许将JavaScript代码段直接内嵌入HTML文档，所以我们需要通过外部引入的方式引用JS文件。当然inline-script也是被禁止的，所以所有元素的事件都需要使用JavaScript代码进行绑定。
- 不要在popup页面的js空间变量中保存数据。

3.标题和badge

将鼠标移至扩展图标上，片刻后所显示的文字就是扩展的标题。标题不仅仅只是给出扩展的名称，有时它能为用户提供更多的信息。比如一款聊天客户端的标题，可以动态地显示当前登录的帐户信息，如号码和登录状态等。所以如果能合理使用好扩展的标题，会给用户带来更好的体验。

```
"browser_action": {
    "default_title": "Extension Title"
}

chrome.browserAction.setTitle({title: 'This is a new title'});
```
Badge相当于APP未读消息数的小气泡。目前只能够通过JavaScript设定显示的内容，同时Chrome还提供了更改badge背景的方法。如果不定义badge的背景颜色，默认将使用红色。badge目前还不支持更改文字的颜色——始终是白色，所以应避免使用浅颜色作为背景。

```
chrome.browserAction.setBadgeBackgroundColor({color: '#0000FF'});
chrome.browserAction.setBadgeBackgroundColor({color: [0, 255, 0, 128]});
chrome.browserAction.setBadgeText({text: 'Dog'});
```

#### 6. 右键菜单、桌面提醒、地址栏（略过）

当用户在网页中点击鼠标右键后，会唤出一个菜单，在上面有复制、粘贴和翻译等选项，为用户提供快捷便利的功能。Chrome也将这里开放给了开发者，也就是说我们可以把自己所编写的扩展功能放到右键菜单中。

要将扩展加入到右键菜单中，首先要在Manifest的permissions域中声明contextMenus权限。

```
"permissions": [
    "contextMenus"
]
"icons": {
    "16": "icon16.png"
}
```

之前的章节提到过利用标题和badge向用户提供有限的信息，那么如果需要向用户提供更加丰富的信息怎么办呢？Chrome提供了桌面提醒功能，这个功能可以为用户提供更加丰富的信息。

```
"permissions": [
    "notifications"
]
```

创建桌面提醒非常容易，只需指定标题、内容和图片即可。下面的代码生成了标题为“Notification Demo”，内容为“Merry Christmas”，图片为“icon48.png”的桌面提醒窗口。

```
var notification = webkitNotifications.createNotification(
    'icon48.png',
    'Notification Demo',
    'Merry Christmas'
);
notification.show();
```

需要注意的是，对于要在桌面窗口中显示的图片，必须在Manifest的web_accessible_resources域中进行声明，否则会出现图片无法打开的情况：

```
"web_accessible_resources": [
    "images/*.png"
]
```

桌面提醒窗口提供了四种事件：ondisplay、onerror、onclose和onclick。

除了用户主动关闭桌面提醒窗口外，还可以通过cancel方法自动关闭。

```
setTimeout(function(){
    notification.cancel();
},5000);
```

#### 7. 管理你的浏览器

1.书签

Chrome为开发者提供了添加、分类（书签文件夹）和排序等方法来操作书签，同时也提供了读取书签的方法。
要在扩展中操作书签，需要在Manifest中声明bookmarks权限：

```
"permissions": [
    "bookmarks"
]
```

2.Cookies

Cookies是浏览器记录在本地的用户数据，如用户的登录信息。Chrome为扩展提供了Cookies API用以管理Cookies。
要管理Cookies，需要在Manifest中声明cookies权限，同时也要声明所需管理Cookies所在的域：

```
"permissions": [
    "cookies",
    "*://*.google.com"
]
"permissions": [
    "cookies",
    "<all_urls>"
]
```

3.历史

历史用于记录用户访问过页面的信息。与书签一样，历史也是浏览器很早就具有的功能，对用户来说也是一个很重要的功能。Chrome提供了history接口，允许扩展对用户的历史进行管理。

要使用history接口，需要在Manifest中声明history权限：
```
"permissions": [
    "history"
]
```

4.管理扩展与应用

除了通过chrome://extensions/管理Chrome扩展和应用外，也可以通过Chrome的management接口管理。management接口可以获取用户已安装的扩展和应用信息，同时还可以卸载和禁用它们。通过management接口可以编写出智能管理扩展和应用的程序。

要使用management接口，需要在Manifest中声明management权限：

```
"permissions": [
    "management"
]
```

5.标签

Chrome通过tabs方法提供了管理标签的方法与监听标签行为的事件，大多数方法与事件是无需声明特殊权限的，但有关标签的url、title和favIconUrl的操作（包括读取），都需要声明tabs权限。

```
"permissions": [
    "tabs"
]
```

6.Override Pages

Chrome不仅提供了管理书签、历史和标签的接口，还支持用自定义的页面替换Chrome相应默认的页面，这就是override pages。目前支持替换的页面包含Chrome的书签页面、历史记录和新标签页面。

使用override pages很简单，只需在Manifest中进行声明即可（一个扩展只能替换一个页面）：

```
"chrome_url_overrides" : {
    "bookmarks": "bookmarks.html"
}
"chrome_url_overrides" : {
    "history": "history.html"
}
"chrome_url_overrides" : {
    "newtab": "newtab.html"
}
```

#### 8. 高级API

1.下载 

```
"permissions": [
    "downloads"
]
chrome.downloads.download(options, callback);
// options
{
    url: 下载文件的url,
    filename: 保存的文件名,
    conflictAction: 重名文件的处理方式,
    saveAs: 是否弹出另存为窗口,
    method: 请求方式（POST或GET），
    headers: 自定义header数组,
    body: POST的数据
}
```

2.网络请求

Chrome提供了较为完整的方法供扩展程序分析、阻断及更改网络请求，同时也提供了一系列较为全面的监听事件以监听整个网络请求生命周期的各个阶段。

要对网络请求进行操作，需要在Manifest中声明webRequest权限以及相关被操作的URL。如需要阻止网络请求，需要声明webRequestBlocking权限。

```
"permissions": [
    "webRequest",
    "webRequestBlocking",
    "*://*.google.com/"
]
```

3.代理

代理可以让用户通过代理服务器浏览网络资源以达到匿名访问等目的。代理的类型有多种，常用的包括http代理和socks代理等。有时我们不希望所有的网络资源都通过代理浏览，这种情况下通常会使用pac脚本来告诉浏览器使用代理访问的规则。

Chrome浏览器提供了代理设置管理接口，这样可以让扩展来做到更加智能的代理设置。要让扩展使用代理接口，需要声明proxy权限：

```
"permissions": [
    "proxy"
]
```

4.系统信息

Chrome提供了获取系统CPU、内存和存储设备的信息。











