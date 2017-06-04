# ES6之我见

![http](https://github.com/94dreamer/Note/blob/master/ES6之我见/img/)

> 本文依据阮一峰老师的[《ECMAScript 6入门》](http://es6.ruanyifeng.com/)一书作为参考书，结合网络共享资源对ES6标准诸多特性进行一一分析，或跳过一些理解不到位的。

### 一、 为什么要学习ES6？

- 因为ES6是官方标准，是未来浏览器支持方向。
- 大量框架新版本都已经广泛使用ES6的语法（React、Angular、Vue）。
- Babel的出现让ES6提前登上舞台。
- 便捷的语法糖和新特性解决了js的类库引用。

### 二、 我们首先需要掌握babel的使用

因为各大浏览器和运行环境对ES6的支持情况参差不齐，一般的产品来讲对浏览器兼容性存在一定要求，所以我们不能‘裸写’ES6代码发布上线。在实际项目开发中，需要降级为ES5语法以兼容各平台。

我们选择使用`babel`作为编译工具完成这个事情。 
[我的babel配置.md](https://github.com/94dreamer/Note/blob/master/Redux%E7%9A%84subscribe%E7%9A%84%E5%9B%B0%E5%A2%83/babel%E9%85%8D%E7%BD%AE.md)。

- babel-polyfill

	需要说明的是*Babel默认只转换新的JavaScript语法，而不转换新的API*。
	
	比如：Babel可以主动编译 let，const等特性，但是诸如Iterator、Generator、Reflect、Promise等全局对象，或者数组的find这些新方法并不会得到编译。如果我们想要Babel主动转换他们，就需要使用`babel-polyfill`，同时要保证这个polyfill在你的所有其他脚本之前。同时，因为编译产出ES5代码，所以我们又需要加入ES5-shim，ES5-sham在所有代码之前。
	
	实际情况下，我们放弃了使用babel-polyfill，这是出于减少JS引用的考虑。其次，ES6新增的方法我们并不一定使用到，ES6新特性被广泛使用的大多是let，const，结构，箭头函数等，这些使用Babel默认的编译就可以达到要求了。对于Promise这种广泛使用的特性，我们引入单独的polyfill来处理。

- babel-runtime

	babel-runtime是为了减少重复代码而生的。Babel编译生成的代码，可能把一些方法的编译代码，在每个使用处生成一份重复的。这种冗余是我们不能够忍受的。
	
	babel-runtime能够把这些工具函数的代码转换成require语句。
	
	`reuire('babel-runtime/helpers/classCallCheck');`

### 三、广泛使用的ES6特性

- 默认参数
- 模版表达式
- 多行字符串
- 解构赋值
- 改进的对象表达式
- 箭头函数
- Promise
- 块级作用域let和const
- 类class
- 模块化

#### 1. let和const命令

说老实话，let和const的出现一定程度上增大了我们的选择难度。  
现在块级作用域的变量我们用let，而不变的常用我们用const。var反而有点无所适从了。

#### 2. 变量的解构赋值

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

#### 3. 字符串的扩展

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

(3) 标签模版

#### 4. 正则的扩展

#### 5. 数值的扩展

(1) 扩展方法

`Number.isFinite(num)` 用来检查一个数值num是否为有限的（finite）。

`Number.isNaN(num)` 用来检查一个值是否为NaN。

与传统的全局方法isFinite()和isNaN()的区别在于，传统方法会隐式转换再判断，而这两个新方法支队数值有效，非数值一律false。

`Number.isInteger(num)` 用来判断一个值是否是整数。

(2) 指数运算符

```
2 ** 2 //4
2 ** 3 //8

let a=2;
a **=3;
//等于a= a * a * a； 
```

#### 6. 数组的扩展

(1) `Array.from()` 转数组

(2) `Array.of()` 将一组值，转换为数组。


(3) `copyWithin()` 将指定位置的成员复制到其他位置，修改当前数组

(4) 数组实例的`find()`和`findIndex()`

`find()`用于找到第一个符合条件的数组成员

(5) `fill()` 用给定的值填充一个数组

(6) `entries(),keys(),values()` 分别返回键值对、键名、键值的遍历器。

#### 7. 函数的扩展

(1)函数参数的默认值

(2)rest参数

(3)扩展运算符
>非常好用的特性

```
// ES5
[1, 2].concat(more)
// ES6
[1, 2, ...more]
// ES5
a = list[0],rest=list.slice(1)
// ES6
[a,...rest] = list
```

(4)严格模式

```
function doSomething(a,b){
	'use strict';
	//code
}
```
(5)name 属性

函数的`name`属性，返回该函数的函数名。

(6)箭头函数

箭头函数内的this对象，指向定义时所在的上下文，而不是使用时所在的上下文／不可以当作构造函数，无法使用new／不可以使用argument对象，可以用Rest参数代替／不可以使用yield命令，不能用做Generator函数。

(7)绑定 this

函数绑定运算符是并排的两个双冒号(::)，双冒号左边是一个对象，右边是一个函数。该运算符会自动将左边的对象，作为上下文环境，绑定到右边的函数上面

```
foo::bar;
// 等同于
bar.bind(foo);
```

(8)尾调用优化

(9)函数参数的尾逗号

允许函数的最后一个参数有尾逗号。

#### 8. 对象的扩展

(1) 属性的简洁表示法

允许直接写入变量和函数，作为对象的属性和方法。

(2) Object.assign()


#### 9. Symbol

新的原始类型，表示独一无二的值。

#### 10. Set和Map数据结构

#### 11. Proxy

Proxy 用于修改某些操作的默认行为，等同于在语言层面做出修改，所以属于一种“元编程”，即对编程语言进行编程。

#### 12. Reflect

Reflect 也是ES6为了操作对象而提供的新API。

(1) 将Object对象一些明显属于语言内部的方法，放到Reflect对象上。
(2) 修改某些Object方法的返回结果。
(3) 让Object操作都变成函数行为。
(4) Reflect对象的方法与Proxy对象的方法一一对应。

#### 13. Iterator和for...of循环



#### 14. Generator函数

Generator函数是ES6提供的一种异步编程解决方案，语法行为与传统函数完全不同。
Generator函数是一个状态机，封装了多个内部状态。

#### 15. Promise对象

(1) 对象的状态不受外界影响。Promise对象代表一个异步操作，有三种状态：Pending、Resolved、Rejected。
(2) 一旦状态改变，就不会再变，任何时候都可以得到这个结果。

有了Promise对象，就可以将异步操作以同步操作的流程表达出来，避免了层层嵌套的回调函数。

```
var promise = new Promise(function(resolve,reject){
	//...some code
	
	if(/* 异步操作成功 */){
		resolve(value);
	}else{
		reject(error);
	}
})
```

#### 16.异步操作和Async函数

#### 17.Class

#### 18.Decorator

#### 19.Module

早在大概7、8年前，因为Web应用的复杂度上升，就已经出了JS的模块化思想，主要分为两派：AMD、CMD。

区别他们的是 `Module` 是ES6的新特性，是语言层面对模块化的支持。

> 与之前的Node的commonJs和SeaJs模块打包的区别开来的模块加载机制不同，Module是动态的加载，导入的是变量的 `只读引用` ，而不是拷贝

我可以把前者看作是静态的打包，后者则是动态的打包。为什么这么说呢？我们看一下ES6的`module`代码：

```
// 1. export default 可以做默认导出

// a.js
export default 5；	// 默认导出

// b.js
import b, {a} from './a.js'；

// 2. 动态的加载机制

// a.js

export let a = 10;
export let b = 10;
export function add(){
	a = 15;
	b = 20;
	return a+b;
};

// b.js
import {a,b,add} from './a.js';
a+b;	// 20
add();	//35
a+b;	//35
```


















