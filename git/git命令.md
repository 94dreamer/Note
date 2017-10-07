> 欢迎添加和改正😊

### 创建 CREATE

克隆一个现有的仓库

```
$ git clone ssh://user@domain.com/repo.git
```

创建一个本地的新仓库 

```
$ git init
```

### 本地改变 LOCAL CHANGES

查看工作区的变动文件

```$ git status
```

跟踪文件的变动

```
$ git diff
```
添加当前全部的改动到到下一次提交

```$ git add .
```

添加一些指定文件的改动到下一次提交

```
$ git add -p <file>```

提交所有本地被追踪的文件的改动

```$ git commit -a```

提交之前阶段的改动

```$ git commit
```

更改最后一次的提交（不要修改已发布的提交）

```$ git commit --amend
```

### 提交历史 COMMIT HISTORY

展示所有提交，从最新的开始

```
$ git log
```

展示记录内指定文件的改动
```
$ git log -p <file>
```

谁在什么时间修改了文件的什么内容

```
$ git blame <file>
```

### 分支和标签 BRANCHES & TAGS

列出现有的所有分支

```
$ git branch -av
```

切换分支

```
$ git checkout <branch>
```

创建一个新分支从当前的分支上

```
$ git branch <new-branch>
```

创建一个新的追踪分支从一个远程分支上

```
$ git checkout --track <remote/branch>
```

删除一个本地分支

```
$ git branch -d <branch>
```

在当前的这次提交打上一个标记

```
$ git tag <tag-name>
```

### 升级和推送 UPDATE & PUBLISH

列出所有当前远程的配置

```
$ git remote -v
```

展示远程信息
```
$ git remote show <remote>
```

添加一个新的远程仓库，命名为<remote>

```
$ git remote add <shortname> <url>
```

下载远程所有的变化，但是不要融入头

```
$ git fetch <remote>
```

下载变更并融入头

```
$ git pull <remote> <branch>
```

推送本地的改动到远程

```
$ git push <remote> <branch>
```

删除远程的分支

```
$ git branch -dr <remote/branch>
```

推送你的标签

```
$ git push --tags
```

### 合并和 MERGE & REBASE

合并分支到你当前的分支

```
$ git merge <branch>
```

选择一个commit，合并进当前分支

```
git cherry-pick <commit>
```

rebase合并

```
$ git rebase <branch>
```

中止rebase的行动

```
$ git rebase --abort
```

继续rebase动作

```
$ git rebase --continue
```

调用工具解决冲突

```
$ git mergetool
```

添加、删除工作区文件
```
$ git add <resolved-file>
$ git rm <resolved-file>
```

### 撤销 UNDO

抛弃你的工作区所有本地的改动

```
$ git reset --hard HEAD
```

抛弃指定文件的本地改动

```
$ git checkout HEAD <file>
```

恢复一个提交（同时产生了一个新的相反提交）

```
$ git revert <commit>
```

恢复到你指定的提交点，抛弃并丢失掉之后的所有改动

```
$ git reset --hard <commit>
```

回退版本到指定提交点

```
$ git reset <commit>
```



