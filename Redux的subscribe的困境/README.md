### 1. [内附PPt](https://github.com/94dreamer/Note/tree/master/Redux%E7%9A%84subscribe%E7%9A%84%E5%9B%B0%E5%A2%83/ppt)

### 2. [以及如何在node命令行下使用ES6/ES2017](https://github.com/94dreamer/Note/blob/master/Redux%E7%9A%84subscribe%E7%9A%84%E5%9B%B0%E5%A2%83/babel%E9%85%8D%E7%BD%AE.md)

### 3. Redux的subscribe的困境


下面这段代码可以基于subscribe封装一个更高级的API，用作监听state：

```
function observeStore(store, select, onChange) {
  let currentState;  //闭包保存上一次的state

  function handleChange() { //又一个闭包
    let nextState = select(store.getState()); //用传入的select筛选需要的state对象的某个值
    if (nextState !== currentState) {
      currentState = nextState;
      onChange(currentState);
    }
  }

  let unsubscribe = store.subscribe(handleChange);
  handleChange();
  return unsubscribe;
}
```