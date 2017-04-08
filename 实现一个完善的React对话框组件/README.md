## 实现一个完善的React对话框组件

对话框Dialog作为Web前端的典型组件，在任何一种Web系统内的占比都举重若轻，我们每一种前端框架的使用者都需要对对话框做封装，让其方便调用，来服务我们的前端开发。  
接下来我们就一起来构思并实现一个尽可能完善的 *React对话框组件*，这个过程中我们的 HTML／CSS／JS 高度内聚，实现了即插即用的效果，代表了未来`Web Components`的趋势。

1. 描述功能

我们想要这么一个Dialog组件，至少包括如下功能

- 基本的对话框样式，并支持自定义覆盖样式
- 自定义的点击按钮和点击回调
- 任意的content内容，并支持选择content的高度宽度scroll能力选择
- 有模态控制，非模态下可以点击Dialog以外关闭对话框
- 窗口resize时、content内容update时，可以控制是否重新定位Dialog的居中位置

2. 基本的HTML结构

```
<div className="box-container"> <!--最外层容器-->
<div className="dialog-container"> <!--定位容器／动画容器-->
    <div className="dialog"> <!--dialog容器-->
        <div className="dialog-title"> <!--顶部标题栏-->
            <p>{title}</p>
            <button>X</button>
        </div>
        <div className="dialog-content"> <!--主体容器-->
            {this.props.children}
        </div>
        <div className="dialog-action"> <!--底部按钮容器-->
            <button>取消</a>
            <button>确定</a>
        </div>
    </div>
</div>
<div className="overlay"></div> <!--遮罩层-->
</div>
```
3. 基本CSS布局

Modal框的背景mask样式通过position:fixed + top/right/bottom/left:0 + height: 100%实现。
不定宽高的主体内容水平垂直居中的实现通过position:fixed + top/left: 50% + translate(-50%, -50%)实现。

> 为什么dialog的组件DOM一定要放在body根下，fixed不是无论DOM层级在哪都是根据body定位吗？

因为fixed元素并不总是相对于视窗进行定位的，父元素发生变换，也就是transfrom属性发生改变，如平移或旋转，会对固定定位的子元素产生影响。
[固定定位不固定](http://codepen.io/huangbuyi/pen/mRYXbg)

4. 