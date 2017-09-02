## React 内部原理 一：渲染原理

通过我们5个part的系列讲解，我们将再造一个微型的React，通过这种方式来学习React是如何工作的。我可以保证，一旦我们完成了这个过程，我们将会非常好的掌握React的运行原理，包括在code时清楚的知道该何时何地调用React组件的生命周期回调。

### 目录：

- [一、 渲染原理](./渲染原理)
- [二、 componentWillMount和componentDidMount](./componentWillMount和componentDidMount)
- [三、更新原理](./更新原理)
- [四、setState](./setState)
- [五、transactions](./transactions)

### 特别声明

这个系列都是基于react 15.3的，特别是用reactDOM和stack reconciler。新的fiber reconciler 不适合应用于这里。我们将要建立的react 克隆，跟执行所有的react没有多大的关联。但是feact的源代码会尽可能反映出react。

### 背景：elements 和 components
React的核心是是三种不同的实体：native elements，virtual element 和 components。

### Native DOM elements

他们正如他们所听起来的那样，真正的DOM elements是浏览器用作网页的构成要素。在某些点，react会召集document.createElement() 为一个，并且使用浏览器的DOM api去升级那些element.insertBefore(), element.nodeValue,

### Virtual react elements

一个Virtual react element（也叫源代码的一个element）是代表你想要的DOM Element 的特有的渲染。一个element既能直接代表一个DOM element，例如h1, div等等，也能代表一个用户定义的合成的component，下面有我的解析。

### Components

在react里“component”是一个十分通用的术语。他们是react里的实体同事还做很多的不同的工作。不同的components做不同的工作。举个例子，ReactDOM里的ReactDOMComponent负责拉近react element和其对应的native DOM elements。

### 用户定义的合成components

你应该已经熟悉这一种component：合成component。

### 

 



