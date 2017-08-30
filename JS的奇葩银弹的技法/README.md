## JavaScript 之银弹の技法

> 下文这些`淫巧`在之前自认为是居家必备，装逼撩妹的必备之物，博主一直敝帚自珍，不愿拿出来分享，现如今，ES6+极尽能事，我知道再不拿出来就在没有价值了😢  

#### 来由

博主入行前端写JavaScript时候，因为需要兼容IE低版本，时常需要在繁杂冗长的DOM操作夹杂的代码中，尽可能巧妙地节省代码了，保持代码清洁和逼格，久而久之，在维护前辈旧代码和新功能开发时积累了一套代码书写的`奇技淫巧`，你也可以把它看作是抖机灵，不过它的确是丰盈了我的codeの时光，让我们不至书写业务那么枯燥。  

#### 目录

- [1. 取整](#取整)
- [2. 多行字符串](#多行字符串)
- [3. 快速输出重复字符串](#快速输出重复字符串)
- [4. 用`switch case`代替`if else`](#用switchcase代替ifelse)
- [5. 截取数组](#截取数组)
- [6. 获取数组中的最大值和最小值](#获取数组中的最大值和最小值)
- [7. 日期转数字](#日期转数字)
- [8. 用 && || ?: , 节省代码行数](#用&&||?:,节省代码行数)
- [9. 隐式转换](#隐式转换)
- [10. 利用对象数组取值、方法](#利用对象数组取值、方法)
- [11. 匿名函数的N种写法](#匿名函数的N种写法)

---

#### 1. 取整 （任性指数： ⭐️⭐️⭐️⭐️⭐️）

```
var a = ~~1.2; //1
```
还可以用位右移符>>

```
var a = 3.4>>0; //3 
```

简单解释，~是按位取反的运算符，可以将浮点数通过舍去小数点后面的所有位来转换为整数。
> 注意：如果需要做严格的四舍五入运算就要慎用此方法，那就还是得用Math函数

#### 2. 多行字符串 （银弹指数： ⭐️⭐️⭐️⭐️）

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

#### 3. 快速输出重复字符串（脑洞指数： ⭐️⭐️⭐️⭐️⭐️）

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

#### 4. 用`switch case`代替`if else`（脑洞指数： ⭐️⭐️⭐️⭐️）

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

#### 5. 截取数组	（奇葩指数： ⭐️⭐️⭐️）

```
var arr = [1,2,3,4,5,6];
arr = arr.slice(0,3);
```
我们可以利用length在这种情况
```
var arr = [1,2,3,4,5,6];
arr.length=3;
```

#### 6. 获取数组中的最大值和最小值 （实用指数： ⭐️⭐️⭐️⭐️）

```
var numbers = [ 5, 458, 120, -215, 228, 400, 122205, -85411 ];
var maxInNumbers = Math.max.apply(Math, numbers);
var minInNumbers = Math.min.apply(Math, numbers);
```

#### 7. 日期转数字 （银弹指数： ⭐️⭐️⭐️）

```
var time1 = new Date().getTime();
```

我们可以这样

```
var time2 = + new Date();
```

#### 8. 用 && || ?: , 节省代码行数 （用多了会被打指数： ⭐️⭐️⭐️⭐️⭐️）

在我们代码简短的判断逻辑，我们经常会使用运算符去实现，用`if else`反而显得不简洁，特别注意用`,`可以把多个短句合成一句。

```
data = {
        currpage: (obj.role == 4 || obj.role == 7) ? ++_this.curpage_store : ++_this.curpage_agent,
        ajaxType: 'GET'
}


!localData[type][number] && (localData[type][number] = data, localStorage.setItem(this.jobid, JSON.stringify(localData)));

!$allCity.hasClass('active') ?
			($(this).addClass('active'), $allCity.addClass('active'), lastPos = xk_www.$bd.scrollTop()) :
			($(this).removeClass('active'), $allCity.removeClass('active'), lastPos != null && xk_www.$bd.animate({
				scrollTop: lastPos
			}));
```

#### 9. 隐式转换 （实用指数： ⭐️⭐️⭐️⭐️⭐️）

```
data.isDeep == ‘0’;	// 有时候返回的deep可能为0可能为“0”
data.isDeep > 0 ;
...
```

合理优雅的运用JavaScript的弱类型特点的灵活性，可以在很多时候巧妙地做到节省代码量，如果我们很好掌握隐式转换，比如在很多时候我们用`==`反而比`===`更得心应手，用`>`的布尔比较反而比严格的类型检查和值比较更快捷。


#### 10. 利用对象数组取值、方法 （实用指数： ⭐️⭐️⭐️⭐️）

```
const config={
    1:"周一",
    2:"周二",
    3:"周三",
    4:"周四",
    5:"周五",
    6:"周六",
    7:"周日",
};
config[1];

const doSomething={
    a(){
        ...
    }
    b(){
        ...
    }
    c(){
        ...
    }
    d(){
        ...
    }
}
doSomething("a");
```

#### 11. 匿名函数的N种写法 （涨姿势指数： ⭐️⭐️⭐️⭐️）

js的匿名函数是未申明函数名的自执行函数，格式是这样的

```
(function(){})();
```

但是在实际项目中，我们经常这么些，在前面加上`;`或者`+`

```
;function(){}();
+function(){}();
```

虽然JS的语法是可以省略分号的，为了避免代码上线后合并压缩成一个文件可能造成的语法错误，所以加上“;”可以避免未知错误。

而“+”在这里是运算符，运算符具有极高的优先级，所以右边的函数声明加上括号的部分（实际上就是函数执行的写法）就直接执行了。其实不止前面可以是“+”号，“-”、“！”、“~”、“++”等运算符均可。

