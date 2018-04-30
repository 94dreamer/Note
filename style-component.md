### 高级特性

#### Theming

`styled-components`暴露了一个`<ThemeProvider>`容器组件，提供了设置默认主题样式的功能，他类似于`react-rudux`的顶层组件`Provider`，通过`context`实现了从顶层到底层所有样式组件的默认主题共用。

```
const Button = styled.button`
  font-size: 1em;
  margin: 1em;
  padding: 0.25em 1em;
  border-radius: 3px;
  
  /* Color the border and text with theme.main */
  color: ${props => props.theme.main};
  border: 2px solid ${props => props.theme.main};
`;

Button.defaultProps = {
  theme: {
    main: 'palevioletred'
  }
}
// Define what props.theme will look like
const theme = {
  main: 'mediumseagreen'
};

render(
  <div>
    <Button>Normal</Button>
    <ThemeProvider theme={theme}>
      <Button>Themed</Button>
    </ThemeProvider>
  </div>
);
```

#### Refs

通常我们在给一个非原生样式组件添加`ref`属性的时候，其指向都是该组件实例的索引，我们通过用`innerRef`可以直接拿到里面的`DOM`节点。

```
const AutoFocusInput = styled.input`
  background: papayawhip;
  border: none;
`;

class Form extends React.Component {
  render() {
    return (
      <AutoFocusInput
        placeholder="Hover here..."
        innerRef={x => { this.input = x }}
        onMouseEnter={() => this.input.focus()}
      />
    );
  }
}
```

#### Security

因为`styled-components`允许我们使用任意输入作为`CSS`属性值，一旦意识到这一点，我们马上明白要对输入做安全性校验了，因为使用用户外部的输入样式可以导致用户的浏览器被CSS注入攻击。CSS注入攻击可能不明显，但是我们还是得小心一点，某些IE浏览器版本甚至允许在URL声明中执行任意的JS。

这个例子告诉我们外部的输入甚至可能在CSS内调用一个API网络请求。

```
// Oh no! The user has given us a bad URL!
const userInput = '/api/withdraw-funds';

const ArbitraryComponent = styled.div`
  background: url(${userInput});
  /* More styles here... */
`;
```

[`CSS.escape`](https://developer.mozilla.org/en-US/docs/Web/API/CSS/escape)这个未来API标准可净化JS中的CSS的问题。但是浏览器兼容性目前还不是太好，所以我们建议在项目中使用[`polyfill by Mathias Bynens`](https://github.com/mathiasbynens/CSS.escape)。

#### CSS共存

如果我们打算把`styled-components`和现有的`css`共存的话，我们需要注意两个实现的细节问题：

`styled-components`也会生成真实的样式表，并通过`className`属性链接生成的样式表内容。在JS运行时，他会生成一份真实的style节点插入到document的head内。

注意的一个小地方：  

```
// MyComponent.js
const MyComponent = styled.div`background-color: green;`;

// my-component.css
.red-bg {
  background-color: red;
}

// For some reason this component still has a green background,
// even though you're trying to override it with the "red-bg" class!
<MyComponent className="red-bg" />
```

我们`styled-components`生成的style样式表一般是在head头部的最底下，同等CSS优先级条件下是会覆盖默认前者css文件的样式的。这个插入顺序使用webpack来调整是比较难得。所以，我们一般都这样通过调整css优先级来改变显示：

```
/* my-component.css */
.red-bg.red-bg {
  background-color: red;
}
```

#### Media Templates

媒体查询是开发响应式web应用不可或缺的存在，这是一个简单的例子：

```
const Content = styled.div`
  background: papayawhip;
  height: 3em;
  width: 3em;

  @media (max-width: 700px) {
    background: palevioletred;
  }
`;

render(
  <Content />
);
```

因为媒体查询语句很长，并且经常在整个应用程序中重复使用，所以为此创建一些模板来复用是很有必要的。

使用JS的功能特性，我们可以轻松定义一份可配置的语句，包装媒体查询和样式。

```
const sizes = {
  desktop: 992,
  tablet: 768,
  phone: 376
}

// Iterate through the sizes and create a media template
const media = Object.keys(sizes).reduce((acc, label) => {
  acc[label] = (...args) => css`
    @media (max-width: ${sizes[label] / 16}em) {
      ${css(...args)}
    }
  `

  return acc
}, {})

const Content = styled.div`
  height: 3em;
  width: 3em;
  background: papayawhip;

  /* Now we have our methods on media and can use them instead of raw queries */
  ${media.desktop`background: dodgerblue;`}
  ${media.tablet`background: mediumseagreen;`}
  ${media.phone`background: palevioletred;`}
`;

render(
  <Content />
);
```

这太cool了，不是吗？

#### Tagged Template Literals

标签模板是ES6的一个新特性，这是我们`styled-components`创建样式组件的方式和规则。

```
const aVar = 'good';

// These are equivalent:
fn`this is a ${aVar} day`;
fn([ 'this is a ', ' day' ], aVar);
```

这看起来有点麻烦，但是这意味着我们可以在`styled-components`生成样式组件中接受变量、函数、minxins，并将其变为纯css。

这篇文章可以了解更多：[The magic behind 💅 styled-components](https://mxstbr.blog/2016/11/styled-components-magic-explained/)

#### Server Side Rendering

`styled-components`很好地支持SSR。

一个例子：

```
import { renderToString } from 'react-dom/server'
import { ServerStyleSheet } from 'styled-components'

const sheet = new ServerStyleSheet()
const html = renderToString(sheet.collectStyles(<YourApp />))
const styleTags = sheet.getStyleTags() // or sheet.getStyleElement()
```

也可以这样组件化包裹，只要在客户端不这么使用：

```
import { renderToString } from 'react-dom/server'
import { ServerStyleSheet, StyleSheetManager } from 'styled-components'

const sheet = new ServerStyleSheet()
const html = renderToString(
  <StyleSheetManager sheet={sheet.instance}>
    <YourApp />
  </StyleSheetManager>
)

const styleTags = sheet.getStyleTags() // or sheet.getStyleElement()
```

`sheet.getStyleTags()`返回一个style标签数组。具体`styled-components`关于SSR更深入的操作，不在这里继续讨论了，还可以告知他兼容`Next.js`关于`SSR`的解决方案。

#### Referring to other components

`styled-components`提供了`component selector`组件选择器模式来代替我们以往对class名的依赖，解决得很干净。这下我们不必为命名和选择器冲突而苦恼了。


```
const Link = styled.a`
  display: flex;
  align-items: center;
  padding: 5px 10px;
  background: papayawhip;
  color: palevioletred;
`;

const Icon = styled.svg`
  transition: fill 0.25s;
  width: 48px;
  height: 48px;

  ${Link}:hover & {
    fill: rebeccapurple;
  }
`;

const Label = styled.span`
  display: flex;
  align-items: center;
  line-height: 1.2;

  &::before {
    content: '◀';
    margin: 0 10px;
  }
`;

render(
  <Link href="#">
    <Icon viewBox="0 0 20 20">
      <path d="M10 15h8c1 0 2-1 2-2V3c0-1-1-2-2-2H2C1 1 0 2 0 3v10c0 1 1 2 2 2h4v4l4-4zM5 7h2v2H5V7zm4 0h2v2H9V7zm4 0h2v2h-2V7z"/>
    </Icon>
    <Label>Hovering my parent changes my style!</Label>
  </Link>
);
```

注意：

```
class A extends React.Component {
  render() {
    return <div />;
  }
}

const B = styled.div`
  ${A} {
  }
`;
```

这个例子是不可以的，因为A继承ReactComponent，不是被styled构造过的。我们的组件选择器只支持在`Styled Components`创建的样式组件。

```
class A extends React.Component {
  render() {
    return <div className={this.props.className} />;
  }
}

const StyledA = styled(A)``;

const B = styled.div`
  ${StyledA} {
  }
`;
```

### API文档

#### 基本 

- styled

- .attrs

- ``字符模板

- ThemeProvider

#### 助手

- css

- keyframes

- injectGlobal

- isStyledComponent

- withTheme

#### 支持CSS

在样式组件中，我们支持所有CSS加嵌套。因为我们生成一个真实的stylesheet而不是内联样式，所以CSS中的任何工作都在样式组件中工作！

（&）被我们所生成的、唯一的类名替换给样式组件，使其具有复杂的逻辑变得容易。

#### 支持flow和typescript

### 更多工具

#### Babel Plugin 

#### Test Utilities

[Jest Styled Components](https://github.com/styled-components/jest-styled-components)，基于jest，可对`styled-components`做单元测试

[demo](https://github.com/styled-components/styled-components-website/tree/master/test)

#### Stylelint

使用stylelint 检查我们的`styled-components`样式书写规范。

#### Styled Theming 语法高亮显示

在模板文本中写入CSS时丢失的一个东西是语法高亮显示。我们正在努力在所有编辑器中实现正确的语法高亮显示。支持大部分编辑器包括Visual Studio Code、WebStorm。

### 总结

下面简单总结一下 styled-components 在开发中的表现：

- 提出了 container 和 components 的概念，移除了组件和样式之间的映射关系，符合关注度分离的模式；
- 可以在样式定义中直接引用到 js 变量，共享变量，非常便利，利用js的特性为css附能，帅毙了！
- 支持组件之间继承，方便代码复用，提升可维护性；
- 兼容现有的 className 方式，升级无痛；
- 这下写CSS也乐趣十足了。
- styled-components的最基本思想就是通过移除样式和组件之间的映射来执行最佳实践
- 一个让styled-components很容易被接受的特性：当他被怀疑的时候，你同样可以使用你熟悉的方法去使用它！

当然，styled-components 还有一些优秀的特性，比如服务端渲染和 React Native 的支持。




 