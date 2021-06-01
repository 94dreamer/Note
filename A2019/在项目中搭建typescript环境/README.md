typescript

## 一、修改webpack配置，用以编译typescript。

### 1. 安装全局依赖包 

`npm install -g typescript`

此刻，其实已经可以命令行调用编译.ts文件了

```
tsc filename.ts
```

即可在ts文件同一目录下生成js文件。如何利用webpack自动编译呢？

其实就如同webpack启用ES6 babel编译类似，但也存在一些区别。


### 2. 基础安装
首先，我们需要增加一个`ts-loader`，如同`sass-loader`处理scss文件一样用以处理ts文件。

```
npm install --save-dev typescript ts-loader
```


### 3. 配置文件

增加`tsconfig.json`在项目根目录，写入一些配置来支持JSX，并将TypeScript编译到ES5

```
{
  "compilerOptions": {
    "outDir": "./dist/",
    "noImplicitAny": true,	 // 在表达式和声明上有隐含的 any类型时报错。
    "module": "es6",		// 指定生成哪个模块系统代码
    "target": "es5",	// 指定ECMAScript目标版本
    "jsx": "react",	// 支持JSX
    "allowJs": true,	// 允许编译javascript文件。
    "experimentalDecorators": true, //启用实验性的ES装饰器。
    "noImplicitAny": true,		// 在表达式和声明上有隐含的 any类型时报错。
	 "sourceMap": true	// 生成相应的 .map文件。
  }
}
```

"compilerOptions"可以被忽略，这时编译器会使用默认值。在这里查看完整的[编译器选项列表](https://www.tslang.cn/docs/handbook/compiler-options.html)。

### 4. 修改webpack配置

关键是增加对ts文件的loader处理,再加上对ts文件的自动解析，这样可在引入模块时不带扩展。

```
module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            }
        ]
},
resolve: {
    extensions: [ '.tsx', '.ts', '.js' ]
},
```

如果之前没有开启过source map，还需要开启

```
devtool: 'inline-source-map',
// 或者
devtool: 'cheap-module-eval-source-map',
```


### 5. 使用第三方库

当从 npm 安装第三方库时，一定要牢记同时安装这个库的类型声明文件。你可以从 [TypeSearch](http://microsoft.github.io/TypeSearch/) 中找到并安装这些第三方库的类型声明文件。

举个例子，如果想安装 lodash 这个库的类型声明文件，我们可以运行下面的命令：

```
npm install --save-dev @types/lodash
```

需要注意的是引入方法也发生了改变。

```
import * as _ from "lodash";
_.padStart("Hello TypeScript!", 20, " ");
```

如果不想每次引入，也可以在tsconfig.json里面设置全局引用。

### 6. 导入其他资源

要在 TypeScript 里使用非代码资源，我们需要告诉 TypeScript 如何兼容这些导入类型。那么首先，我们需要在项目里创建 custom.d.ts 文件，这个文件用来编写自定义的类型声明。让我们将 .svg 文件进行声明设置：

#### custom.d.ts

```
declare module "*.svg" {
  const content: any;
  export default content;
}
```

这里，我们通过指定任何以 .svg 结尾的导入，并将模块的 content 定义为 any，将 SVG 声明一个新的模块。我们可以通过将类型定义为字符串，来更加显式地将它声明为一个 url。同样的理念适用于其他资源，包括 CSS, SCSS, JSON 等。


### 7. 使用JSX

想要使用JSX必须做两件事：

	1. 给文件一个.tsx扩展名
	2. 启用jsx选项




