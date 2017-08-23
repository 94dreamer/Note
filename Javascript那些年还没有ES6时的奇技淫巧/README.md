## Javascript那些年还没有ES6时的奇技淫巧

> 下文这些`淫巧`在之前自认为是居家必备，装逼撩妹的必备之物，博主一直敝帚自珍，不愿拿出来分享，现如今，ES6+极尽能事，我知道再不拿出来就在没有价值了😢  

#### 来由

博主入行前端写JavaScript时候，因为需要兼容IE低版本，时常需要在繁杂冗长的DOM操作夹杂的代码中，尽可能巧妙地节省代码了，保持代码清洁和逼格，久而久之，在维护前辈旧代码和新功能开发时积累了一套`奇技淫巧`，你也可以把它看作是抖机灵，它丰盈了我们的code时光，让我们不至书写业务那么枯燥。  

#### 目录

- [1. 取整]()
- [2. 多行字符串](#多行字符串)
- [3. 快速输出重复字符串](#)

---

1. 取整 

```
var a = ~~1.2; //1
```
还可以用位右移符>>

```
var a = 3.4>>0; //3 
```

2. 多行字符串

```
var temp1 = "<div>" +
    "<p><span>" +
    "<%=data%>" +
    "</span></p></div>";
```

这样一段多行的js字符串我们一般通过行尾`+`字符串来实现连接，这样的写法既不好看，不容易维护，代码量又多，当然我们知道ES6的字符串模版可以轻松实现优雅写法：

```
const temp2 = `
<div>
    <p>
        <span><%=data%></span>
    </p>
</div>`;
```

想知道在远古时代，我们智慧的劳动人民刀耕火种这样写：

```
var temp3 = "<div>\
    <p>\
    <span><%=data%></span>\
    </p>\
 </div>";
```

3. 快速输出重复字符串

我们笨办法是

```
for (var i = 0, temp = ''; i < 200; i++, temp += "leo");
console.log(temp)
```

在ES6+写法中我们使用 `"leo".repeat（200）"`

在以前我们可以这样抖机灵：

```
var temp = Array(200).join("leo");
```

4. 用`switch case`代替`if else`

这种代替可能会让第一次看到的你觉得脑洞大开：这样玩也行？对的，case后面跟上Boolean判断而不是具体值。

```
switch (true) {
    case (a > 10):
        do_something();
        break;
    case (a < 100):
        others();
        break;
    default:
        break;
}
```

5. 截取数组

```
var arr = [1,2,3,4,5,6];
arr = arr.slice(0,3);
```
我们可以利用length在这种情况
```
var arr = [1,2,3,4,5,6];
arr.length=3;
```

6. 获取数组中的最大值和最小值

```
var numbers = [ 5, 458, 120, -215, 228, 400, 122205, -85411 ];
var maxInNumbers = Math.max.apply(Math, numbers);
var minInNumbers = Math.min.apply(Math, numbers);
```

7. 日期转数字

```angular2html
var time1 = new Date().getTime();
```

我们可以这样

```angular2html
var time2 = + new Date();
```