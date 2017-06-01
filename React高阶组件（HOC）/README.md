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

### 二、




