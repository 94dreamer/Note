# setState为什么是异步的

刚接触React的同学，对React的setState的使用偶尔会有一些偏颇，出现一些意料之外的情况。
比如：

```
onClickForReset=()=>{
	this.setState({value: []});
	// 此刻立马取this.state做一些同步操作
	console.log(this.state.value);
}
```
或者是

```
increateCount(){
	this.setState({count: this.state.count + 1});
	this.setState({count: this.state.count + 1});
	this.setState({count: this.state.count + 1});
}
```

有时候我只能粗暴告诉他们：
1. setState是异步的，不会立即改变state的值。
2. 多次setState调用生成的效果会合并。
2. 第二个参数可以是一个回调函数。

现在这篇文章试图尽量弄清两件事：

1. 为什么要把setState设计成异步的，缘由是什么，解决了什么问题，有什么好处？
2. 如何实现异步的setState，整体原理是怎样的，有没有什么特殊的骚操作？

我们可以自己也想一想，下面留给大家一片空白区。😝

```


















```

好，我们带着这两个问题和自己的猜想，试图一探究竟。

## why is `setState` asynchronous?

1. 在批量多次的更新中，延缓到最后合并渲染是有好处的。这一点，和我们熟知的防抖动函数的出发点类似，我们普遍认为在许多情况下在同一时间段，频繁setState触发渲染，连续同步效率很低，对性能有极大损耗。  

我们来看下setState引发组件的更新过程就知道了：

- shouldComponentUpdate
- componentWillUpdate
- render
- componentDidUpdate

每一次setState如果都引发一次组件更新，走完一圈生命周期，实在是有点粗糙和浪费，生命周期函数为纯函数性能应当还能够接受，可是render函数内返回的虚拟DOM去做比较这个就比较费时间了。

直观的感受是，React将多个setState产生的修改放在一个队列里，缓一缓，攒在一起，等待时机，觉得差不多了再引发一次更新过程。这样，在每次更新过程中，会把积攒的setState结果合并，做一个merge的动作，节省render触发的频率。  
这样，对于开发者而言，可以在同步代码中随意多行调用setState函数而不用担心重复setState重复render的问题。

然后，总是被大家误用不理解的也是这一点，所以后来，setState方法的第二个参数慢慢被进入大家的视野了，作为回调函数可以再次拿到新的this.state值。

再后来，一个setState函数的隐藏功能进入了大家的视野，那就是，setState可以接受一个函数作为参数。


## 彩蛋 setState真的是异步吗？

在React中，如果是由React引发的事件处理（比如通过onClick引发的事件处理），调用setState不会同步更新this.state，除此之外的setState调用会同步执行this.state。所谓“除此之外”，指的是绕过React通过addEventListener直接添加的事件处理函数，还有通过setTimeout/setInterval产生的异步调用。

如果我们按照教科书般的方式来使用React，基本上不会触及所谓的“除此之外”情况。

再说为什么会这样：

在React的setState函数实现中，会根据一个变量isBatchingUpdates判断是直接更新this.state还是放到队列中回头再说，而isBatchingUpdates默认是false，也就表示setState会同步更新this.state，但是，有一个函数batchedUpdates，这个函数会把isBatchingUpdates修改为true，而当React在调用事件处理函数之前就会调用这个batchedUpdates，造成的后果，就是由React控制的事件处理过程setState不会同步更新this.state。

另外不仅仅是在react事件系统中是非同步，所有通过react生命周期阶段调用的setstate也都是非同步的，因为每次setstate都会触发更新阶段的生命周期所以按照正常react用法都是会经过batchingUpdate方法的。这是由于react有一套自定义的事件系统和生命周期流程控制，使用原生事件监听和settimeout这种方式会跳出react这个体系，所以会直接更新this.state。

我们看看看看代码是如何：

batchedUpdates 












