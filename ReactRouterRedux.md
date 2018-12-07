## react-router-redux

### redux 与 router

redux 是状态管理的库，router 是(唯一)控制页面跳转的库。两者都很美好，但是不美好的是两者无法协同工作。换句话说，当路由变化以后，store 无法感知到。

于是便有了 react-router-redux。

react-router-redux 是 redux 的一个中间件(中间件：JavaScript 代理模式的另一种实践 针对 dispatch 实现了方法的代理，在 dispatch action 的时候增加或者修改) ，主要作用是：

```
加强了React Router库中history这个实例，以允许将history中接受到的变化反应到state中去。
```

[github 在此](https://github.com/reactjs/react-router-redux)

从代码上讲，主要是监听了 history 的变化：

history.listen(location => analyticsService.track(location.pathname))

### 

