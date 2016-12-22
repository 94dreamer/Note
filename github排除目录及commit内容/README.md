#### 本篇文章主要介绍了"github中不加入版本控制.gitignore设定"，已经把已经commit的文件重新从版本控制中忽略出来。

在git中如果想忽略掉某个文件， 不让这个文件提交到版本库中，可以使用修改 .gitignore 文件的方法。这个文件每一行保存了一个匹配的规则 例如：
##  将被git忽略的
```
*.a       # 忽略所有 .a 结尾的文件
!lib.a    # 但 lib.a 除外
/TODO     # 仅仅忽略项目根目录下的 TODO 文件，不包括ubdir/TODO
build/    # 忽略 build/ 目录下的所有文件
doc/*.txt # 会忽略 doc/notes.txt 但不包括 doc/server/arch.txt
```
这样被设置的将不会被加入版本控制

## 我有一份最简单的
```
/node_modules
/.idea
.DS_Store
```
这些可以忽略`npm的依赖包`（因为通常来说npm依赖包都是脱离一般代码文件大小的范畴，通俗地来讲就是太大了。。。，我们不需要把它加入版本控制，以防他人clone项目的时候下载过慢）

同时我们还排出了编辑器配置文件.idea文件夹和系统文件.DS_Store。这些无关代码项目的配置项文件是不应该上传到git服务器的。

这里还有一些其他的过滤条件

```
？：代表任意的一个字符
＊：代表任意数目的字符
{!ab}：必须不是此类型
{ab,bb,cx}：代表ab,bb,cx中任一类型即可
[abc]：代表a,b,c中任一字符即可
[ ^abc]：代表必须不是a,b,c中任一字符
```
### 尴尬的是，有时候因为遗漏添加了某个文件的ignore。
就是已经commit了，再加入gitignore是无效的，所以这个时候需要删除下缓存。
![commit](https://github.com/94dreamer/Note/blob/master/github排除目录及commit内容/img/commit.png)
## 我们需要做以下操作：
1. git rm -r -n --cached  /node_modules      //-n：加上这个参数，执行命令时，是不会删除任何文件，而是展示此命令要删除的文件列表预览。

2. git rm -r --cached  /node_modules      //最终执行命令.

3. git commit -m"移除src目录下所有文件的版本控制"    //提交

4. git push origin master   //提交到远程服务器

这样就可以移除已经上传到github的文件夹，而不需要删除掉本地的文件😭比如我们含辛茹苦下载的npm依赖包。。。
