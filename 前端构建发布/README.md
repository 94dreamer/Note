# 前端构建发布

试图讲清楚这几件事情：

```
[1. 构建过程做了什么？](#一、构建过程做了什么？)
[2. 构建平台做了什么？](#二、构建平台做了什么？)
[3. 发布平台做了什么？](#三、发布平台做了什么？)
```

除了从大体上了解整个有赞构建发布的流程和设计架构，我们还可以了解一下穿插在其中的奇思妙想以及一些技巧。

## 一、构建过程做了什么？

这个构建过程做了我们从本地打包构建入手，我们先分析本地打包构建的过程，才能进一步理解构建平台的实质工作内容。

以`beauty-web`项目为例，我们构建的命令是`make release`，不同于我以前熟知一些项目的构建命令入口是`npm srcipts`。原因受限于构建平台的规范制约，我们大部分有赞的前端项目的打包命令入口都被`Makefile`命令把控。make 命令执行时，需要一个 Makefile 文件，以告诉 make 命令需要怎么样的去编译和链接程序。 

两者所行使的任务职责没有太大区别,本质都是调用`Shell`去运行脚本命令，只是运行环境环境存在一些不同，`npm srcipts`依赖`node`环境和`npm`，是npm内置的功能，而`Makefile`只需要依赖基本的Linux环境。

我猜测之所以采用`Makefile`来执行编译构建过程的规范，除了计算机构建历史几十年的证明可靠之外，更多的体现在makefile文件更清晰，定义变量等功能比`npm scripts`更大，简单来说，`Makefile`更适用于支撑大型项目，有足够的兜底。

好了，现在我们来看一下`Makefile`文件，从最后一行的`release`看起：

```
release: dist_clean bower yarn_install fabu_branch build_server build_client cdn_assets fabu_push
```

这是`Makefile`的一个多任务目标的写法，他们之间是循环依赖关系，前者执行完成再执行下一个任务，如果我们认为任务之间没有依赖关系，可以同时进行我们可以在调用时带上参数`-j`，如：

```
make -j release
```

但是很显然，我们这个release目标执行的任务是同步执行,所以我们`make release`这样调用。

```
dist_clean：清除缓存目录 => 
bower yarn_install：安装依赖 =>
fabu_branch：git不忽略"dist_client|dist_server”目录，在当前分支新建拉出一个带时间戳的分支 =>
build_server：babel编译server文件到dist_server =>
build_client：webpack打包前端js =>
cdn_assets：使用superman cdn 上传静态资源到cdn =>
fabu_push：在带时间戳的分支下，添加一个名为beauty-web-fabu的远程仓库，提交刚才打包的内容，push到fabu的远程仓库的不带时间戳分支的源分支，push完成后切回源分支，删除带时间戳的分支，remove掉fabu的远程仓库地址。
```

## 二、构建平台做了什么？

架构/Users/zhouzhen/web/youzan_build/worker(打包系统worker/server/babel.app.js

```
- client（打包系统前后端 build.qima-inc.com)
- config(打包系统项目公共配置@youzan/builder-config)
- master(调度中心 build-master.qima-inc.com)
- worker(打包系统worker)
```


我们从使用流程讲起，然后

1. 点击添加任务按钮，开始一个构建任务，需要提供应用名，分支名，构建命令，其他补充（部署预发 & 更新Composer）。

- 应用名从`@youzan/builder-config`拉取枚举常量，可供选择。
- 分支名只有检测功能，原理是从服务器调用gitlab判断是否有该分支的API。（为什么不提供列表选择功能，因为gitlab提供的分支API最多100条每页，需要多次调用进行包装，略显麻烦）
- 构建命令也是从`@youzan/builder-config`拉取对应项目的`commands`数组供选择。
- 其他补充（部署预发 & 更新Composer）会在开始任务消息带上参数`doDeploy=1`。

2. 点击开始任务，socket连接的服务端接受到`startTask`的消息，内部POST调用了自身`http://build.qima-inc.com/api/task`这个接口，返回的成功或者失败会通过socket传递回前端。

3. `api/task`路由下的async函数逻辑：调用了`@youzan/builder-db-service`的`TaskService.createTask`方法，往mysql数据库插入了一条数据，id是11位整形自增长数字。
然后拿着返回的result的id再去POST调用`http://build-master.qima-inc.com/task/${result.id}`接口，`build-master.qima-inc.com`项目就是`master`项目。

4. 跑到`master`查看逻辑，更是一层套一层。。，我们找到核心的async函数`TaskController.startTask`，根据传入的任务id从刚才存入的mysql数据库，把这条数据重新查出来。拿到我们任务的详情，此处再进行一些基本的校验。然后又调用了`@youzan/builder-db-service`的`SubTaskService.createSubTask`方法，存入进入状态的这条数据。

5. 然后，寻找有没有可用的机器，我们调用了`heartBeatWorker.workerList`获取到了真正的执行构建任务的机器，通过`currentStatus==='0'`筛选可用机器，判断可用机器为0则返回`没有空闲的worker`。

6. 如果有可用机器，调用`heartBeatWorker.requestStart`发布开始构建请求。我们连续用到了`heartBeatWorker`的方法，它是我们打包机器的维护者。接着调用了被选中的构建机器的`/api/worker/${id}`，这下我们得进入`worker`项目一探究竟。

7. `handleWorker`的业务逻辑是这样的：首先根据`buildWorker.worker`是否存在判断当前`buildWoker`是否在运行，然后一些系列健壮性判断，如：拿到id到DB查看subTask任务和项目在Config是否存在，塞入该项目Config的`GitLab id`。

8. 接着执行`buildWorker.start`，`start`的逻辑是这样的，通过`child_process.fork`执行一个子进程，运行`woker.js`。

```
this.worker = await child_process.fork(__dirname + '/worker_dist.js').on('exit', async () => {
    // 失败终止
    this.worker = null;
    await shell.kill();
});
// 向子进程发送`start`消息
await this.worker.send({ type: 'start', data });
```

9. 绕了这么一圈，我们终于来到了构建机器执行构建的执行命令。

```
// 
const { id, tid, project, branch, command } = msg.data;
const projectConfig = Config.projects[project];

// 调用gitlab的branch API
const checkResult = await shell.checkBranch(tid, branch);

// sh git_pull.sh ../../../codes/${project}  ${branch}
// |
// cd ../../../codes/${project}     // changing working directory to $1
// unset GIT_DIR                    // unsetting git dir
// git add . && git reset --hard HEAD   // reseting code
// git checkout master                  // cleaning 除了master以外的branches 
// git branch | grep -v "master" | xargs git branch -D
// (if master) git fetch origin master && git merge --ff origin/master
// git fetch origin ${branch}       // fetching branch
// git checkout ${branch}           // checkout branch
// (if hotfix or featurek start)  git fetch origin master   git merge --ff origin/master git pull origin ${branch}
const updateResult = await shell.updateCode(project, branch);   // 如果之前没有这个项目则clone一份

// PATH=$PATH:/opt/gcc/bin CAS_USER=${user} sh ./make.sh ../../../codes/${project} ${command || 'release'}
// |
// cd ../../../codes/${project}
// PATH=$PATH:/opt/gcc/bin make -f $MAKEFILE ${command}
const makeResult = await shell.make(project, command, user);

// sh git_push.sh ../../../codes/${project} ${branch} ${buildProject || project} ${user}
// |
// cd ../../../codes/${project} ${branch}
// unset GIT_DIR
// git add . && git commit -m "$3 built by $4 on machine $HOSTNAME" -n
// git pull origin ${branch}
// git push -u origin ${branch} --no-verify
const pushResult = await shell.pushCode(project, branch, project, user);

process.send({ type: 'over' });
```










