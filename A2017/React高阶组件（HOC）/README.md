### React高阶组件（HOC）

首发地址：[94梦想家](http://94dreamer.com/) 和 [github仓库](https://github.com/94dreamer/)

### 一、什么是React高阶组件？
> 听起来很高大上，其实也就是函数接受一个组件，返回一个新组件。

如果我们用过`react-redux`，就一定看过类似这段代码 `connect(mapDispatchToProps,mapStateToProps)(TabPage)`。这就是react的HOC，把组件当作参数传入，在内部经过处理和额外封装，达到额外添加这部分功能代码复用的效果。他的前身其实是用ES5创建组件时可用的`mixin`方法，但是在react版本升级过程中，使用ES6语法创建组件时，认为`mixin`是反模式，影响了react架构组件的封装稳定性，增加了不可控的复杂度，逐渐被`HOC`所替代。

此时，我们再次用通俗的语言描述一下高阶组件（higher-order component），当react组件被包裹（wrapped）时，高阶组件会返回一个增强版（enhanced）的react组件。我们可以用过柯里化（curry）逐步确定高阶组件的增加功能特性，并把这些特性包裹给参数组件。它可以做什么？高阶组件让我们的功能性代码更具有复用性、逻辑性与抽象特性，它可以对`render`方法做劫持，可以控制`props`和`state`。

这并不是说我们在构建react项目没有高阶组件就不能活了😂，大多数情况下，在UI组件比较多而容器组件比较少，交互复用性较低的情况下，我们是可以不用到高阶组件的。但是我们一旦掌握react的高阶组件，就能极大提高代码复用率，和逻辑代码的可管理度，是我们的代码更加优雅😘。

我们再用代码来表述一下高阶组件

```
// 简单一点的，传入组件，返回额定的封装：
const newComponent = hiderOderFunction(OldComponent);
// 柯里化程度高一些的,通过两次传参进一步确定和缩小高阶组件功能：
const newComponent = hiderOderFunction(params)(OldComponent);
```

### 二、React高阶组件的实现

如果我们学过设计模式，同时用了`HOC`，我们很容易将后者与装饰者模式联系起来。我们通过组合的方式到达很高灵活度的装饰搭配，我们可以将这种思维带到接下来的`HOC`实现。

实现的高阶组件的方法有两种：

- 属性代理。函数通过返回包裹原组件来添加额外功能。
- 反向继承。函数通过返回继承原组件来控制render。

1. 属性代理

属性代理是常见高阶组件的实现方式。

```
//我们来写一个最简单的
const MyContainer = (WrappedComponent) =>class extends Components{
	render(){
		const newProps={
			text:'newText',
		}
		return <WrappedComponent {...this.props} {...newProps} />
	}
}
```

就这么简单我们实现了对原组件props的添加，我们还可以在`MyContainer`内添加各种生命周期和自定义方法实现对`render`时`return`组件的各种控制。

2. 反向继承

反向继承是通过class继承特性来实现高阶组件的一种方式，我们通过简单的代码来理解一下：

```
const MyContainer = (WrappedComponent) = > class extends WappedComponent {
	render (){
		return super.render();
	}
}
```
这种方法和属性代理不太一样，它通过继承WrappedComponent来实现，方法可以通过super来顺序调用。在继承方法中，高阶组件可以使用传入组件的引用，这意味着它可以使用传入组件的state、props、生命周期和render方法。

它有两个比较大的特点。

- 渲染劫持

渲染劫持就是指高阶组件可以控制传入组件的渲染过程，并渲染各种各样的结果。在这个过程中我们可以对输出的结果进行读取、增加、修改、删除props，或读取或修改React元素树，或条件显示元素树，又或是用样式控制包裹元素树。

```
const MyContainer = (WrappedComponent) = > class extends WrappedComponent{
	render(){
		const elementsTree = super.render();
		let newProps={};
		if(elementsTree && elementsTree.type === 'input'){
			newProps = {value:'may the force be with you'};
		}
		const props =  Object.assign({},elementsTree.props,newProps);
		const newElmentsTree = React.cloneElement(elementsTree, props, elmentsTree.props.children);
		
	}
}
```
在这个例子中，WrappedComponent的渲染结果中，顶层的input组件的value被改写成may the force be with you。因为，我们在高阶函数的反向继承实现中可以翻转元素树，改变元素树中的props。

- 控制state

高阶组件可以读取、修改或删除WrappedComponent实例中的state，如果有需要，也可以增加state。但这样做，会使组件的内部状态混乱。大部分高阶组件都应该限制读取或增加state，尤其是后者，可以通过重新命名state，以防止混淆。

### 三、额外的注意点

1. 组件命名

当包裹一个高阶组件时，我们失去了原始WrappedComponents的displayName，而组件名字是方便我们开发与调试的重要属性。

我们参考 react-redux库中的实现：

```
class HOC extends ...{
 static displayName = `HOC(${getDisplayName(WrappedComponent)})`;
}
//getDisplayName方法可以这样实现：
function getDisplayName（WrappedComponent){
	return WrappedComponent.displayName || 
			WrappedComponent.name ||
			'Component';
}
```
或者可以使用recompose库，他已经帮我们实现了对应的方法。

2. 组件参数

这就是一开始我提到过的一点，如何通过柯里化构建更加精确的高阶组件

```
function HOCFactoryFactory(...params){
	//可以做一些改变params的事情
	return class HOCFactory(WrappedComponent){
		remder(){
			return <WrappedComponent {...this.props} />
		}
	}
}
```

当我们使用时，通过两次传参构建更为精准的高阶组件

`HOCFactoryFactory(params)(WrappedComponent)`

这也是利用了函数式编程的特性。

### 四、总结和建议

- 第一次看到`HOC`这个概念，很大一部分人是懵逼的，被这个名词吓到了，以为它是很难得，我也不认为在你没有运用HOC之前初次看完这篇文章就能够拨云见日。
- 吸收`HOC`最好的时机是，当你的组件代码的复用性出现问题，出现了大量没必要的冗余可复用功能性代码时候，你就可以反过来看看`HOC`，一段蹩脚的英文 *when need now，the best time*。
- 高阶组件的出现，代表了react声明式编程的思想方向，我们通过组建组合开发，降低了组件的复杂度，也达到了代码更大的复用度。




