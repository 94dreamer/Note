# ES6之我见

![http](https://github.com/94dreamer/Note/blob/master/ES6之我见/img/)

> 本文依据阮一峰老师的[《ECMAScript 6入门》](http://es6.ruanyifeng.com/)一书作为参考书，结合网络共享资源对ES6标准诸多特性进行一一分析，或跳过一些理解不到位的。

#### 1. 为什么要学习ES6？
- 因为ES6是官方标准，是未来浏览器支持方向。
- 大量框架新版本都已经广泛使用ES6的语法（React、Angular、Vue）。
- Babel的出现让ES6提前登上舞台。
- 便捷的语法糖和新特性解决了js的很多年尿性问题。

#### 2. 我们首先需要掌握babel的使用

[babel配置.md](https://github.com/94dreamer/Note/blob/master/Redux%E7%9A%84subscribe%E7%9A%84%E5%9B%B0%E5%A2%83/babel%E9%85%8D%E7%BD%AE.md)


#### 3. let和const命令

说老实话，let和const的出现一定程度上增大了我们的选择难度。  
现在块级作用域的变量我们用let，而不变的常用我们用const。var反而有点无所适从了。

#### 4. 变量的解构赋值

这是我觉得最方便也是最常用的ES6特性之一了。
  
```
//数组解构赋值
var [a,b,c]=[1,2,3]
//等于
var a=1;
var b=2;
var c=3;
```
对象、数组、字符串、函数参数等都可以进行解构赋值。

用途：
(1) 交换变量的值

`[x,y] = [y,x];`

上面代码交换变量x和y的值，这样的写法简洁易读。

(2) 从函数返回多个值

函数只能返回一个对象或数组，可以通过解构赋值方便取到值

```
function example(){
	return [1,2,3];
}
var [a,b,c]=example();
```

(3) 函数参数的定义

解构赋值可以方便地将一组参数与变量名对应起来。

```
function f([x,y,z]){}
f([1,2,3]);

function({x,y,z}){}
f({z:3,y:2,x:1});
```

(4) 提取JSON数据

解构赋值对提取JSON对象中的数据，尤其有用。

(5) 函数参数的默认值

(6) 遍历Map结构

```
for(let [key,vlaue] of map){
	console.log(key +  "is" + value);
}
```

(7) 输入模块的制定方法

```
const react,{Component,PropTypes} from 'react';
```

#### 5. 字符串的扩展

(1) 基本包装类型方法
`includes()`	返回布尔值，表示是否找到了参数字符串

`startWith()`	 返回布尔值，表示参数字符串是否在原字符串的头部

`endsWith()`  返回布尔值，表示参数字符串是否在原字符串的尾部

这三个方法都支持第二个参数，表示开始搜索的位置。

`repeat()` 返回一个新字符串，表示将原字符串重复n次，
等于这个式子`Array(n).join(str)`。

(2) 模版字符串

用反引号（`）标示。可以当作普通字符串使用，也可以用来定义多行字符串，或者在字符串中嵌入变量。用到反引号要记得用反斜杠转义。

```
var name="Bob";
`Hello ${name},how do you do?
Yes, I'm fine.`
```

(3) 



 


















