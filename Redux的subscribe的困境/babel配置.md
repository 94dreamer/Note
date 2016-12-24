
### 1.要想在命令行中使用babel，需要全局或者本项目安装babel-cli工具，同时需要安装babel的转码依赖包

```
# 安装
$ npm install --save-dev babel-cli

# ES2015转码规则
$ npm install --save-dev babel-preset-es2015

# ES7不同阶段语法提案的转码规则（共有4个阶段），选装一个
$ npm install --save-dev babel-preset-stage-0
$ npm install --save-dev babel-preset-stage-1
$ npm install --save-dev babel-preset-stage-2
$ npm install --save-dev babel-preset-stage-3

```

### 2.新增配置文件.babelrc,这个文件会自动随脚本调用时运行定义好的转译规则。

```
# 内容：
  {
    "presets": [
      "es2015",
      "react",
      "stage-2"
    ],
    "plugins": []
  }
```

plugins可能有很多，比如：

```
    "syntax-class-properties",
    "syntax-decorators",
    "syntax-object-rest-spread",
    "transform-es2015-block-scoping",
    "transform-class-properties",
    "transform-decorators-legacy",
    "transform-object-rest-spread"

```

### 3.基本用法

```
# 转码结果输出到标准输出
$ babel example.js

# 转码结果写入一个文件
# --out-file 或 -o 参数指定输出文件
$ babel example.js --out-file compiled.js
# 或者
$ babel example.js -o compiled.js

# 整个目录转码
# --out-dir 或 -d 参数指定输出目录
$ babel src --out-dir lib
# 或者
$ babel src -d lib

# -s 参数生成source map文件
$ babel src -d lib -s
```

### 4.用package.json保存命令

这样我们就可以改写package.json。

```
{
  "dependencies": {
    "jquery": "^3.1.1",
    "redux": "^3.6.0"
  },
  "devDependencies": {
    "babel-cli": "^6.18.0",
    "babel-preset-es2015": "^6.18.0",
    "babel-preset-stage-0": "^6.16.0"
  },
  "scripts": {
    "build": "babel demo.js -o bundle.js"
  }
}
```

### 5.使用babel-node代替编译文件输出再运行

```
babel-node demo.js
```
同样也可以改写package.json

```
   "scripts": {
    "build": "babel demo.js -o bundle.js",
    "run":"babel-node demo.js"
  }
```

这样只要运行npm run，就可以直接运行demo.js的转码结果，不需要多出一个bundle文件然后再运行bundle.js。






