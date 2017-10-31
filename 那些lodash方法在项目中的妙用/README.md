## lodash

lodash是一套流行的javascript函数工具库，封装了很多对字符串、数组、对象等通用类型数据的处理方法。值得一提的是，在前端使用时候，我们使用时候可以按需引入，减少打包体积，Node在服务端使用当然无所谓。


### 模块组成

lodash提供的工具函数按类型划分为以下几类。[文档地址](http://www.css88.com/doc/lodash/)

```
- Array 			数组方法
- Math				数学方法
- Number			数字方法
- Object			对象方法
- Function			函数方法
- String			字符串方法
- Date 				日期方法
- Collection 		集合方法
- Lang	
- Seq	
- Util	
- Properties
- Methods	
```

#### times	循环N次

```
_.times(5,function(){

});
```

#### cloneDeep 深度克隆

```
var objA = {
	name:'Leo',
}

var objB= _.cloneDeep(objA);
objB === objA	 //false
```
深度克隆JavaScript对象是困难的，并且也没有什么简单的解决方案。你可以使用原生的解决方案： JSON.parse(JSON.stringify(objectToClone))进行深度克隆。但是，这种方案仅在对象内部没有方法的时候才可行。 

#### random 指定范围内获取一个随机值 

```
//原生
function getRandomNumber(min,max){
	return Math.floor(Math.random()*(max-min))+min;
}

getRandomNumber(15,20);

//Lodash
_.random(15,20);
```

Lodash中的random方法要比上面的原生方法更强大与灵活。你可以只传入一个参数作为最大值， 你也可以指定返回的结果为浮点数。 

```
_.random(20);
_.random(15,20,true);
```

#### get

#### set

#### merge

#### assign

#### isEqual

#### compact

 数组去除null、0、false、“”、undefined、NaN项