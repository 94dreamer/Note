## React源码探索（一）

#### 前言

react仓库的项目src下有如下组织:

```
- __mocks__				／／模拟
- isomorphic			//包括一些系列同构方法
- node_modules			//react和react-dom
- renderers				//react的核心代码
- shared				//包含公用、常用方法,如Transaction、CallbackQueue
- test					／/包含测试方法
- umd					//支持umd格式
- ReactVersion.js		//暴露出版本号
- package.json			//json只有name,version,license
```

其中renderers是react项目的核心代码文件夹。

