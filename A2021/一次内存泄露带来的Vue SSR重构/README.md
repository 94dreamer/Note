# 一次内存泄露带来的Vue SSR重构

## 一、问题
#### 直接告警
```
2020-08-05到2020-08-12美业报警量TOP3的应用的TOP3监控信息如下：
appname:  beauty-wap;     env: prod;    item_name:  检测到容器重启;    TotalNumberOfAlarms:  80次
对应的开发稳定性负责人：周振
请尽快跟踪核实业务是否正常，解决问题或者调整监控配置。如有需要请联系PE或监控中心!

<--- Last few GCs --->

[319:0x2d51b10] 21082130 ms: Mark-sweep 1357.1 (1467.4) -> 1357.0 (1467.9) MB, 3239.0 / 0.0 ms  allocation failure GC in old space requested
[319:0x2d51b10] 21084612 ms: Mark-sweep 1357.0 (1467.9) -> 1357.0 (1436.9) MB, 2482.6 / 0.0 ms  last resort GC in old space requested
[319:0x2d51b10] 21087330 ms: Mark-sweep 1357.0 (1436.9) -> 1357.0 (1436.9) MB, 2717.6 / 0.0 ms  last resort GC in old space requested


<--- JS stacktrace --->

FATAL ERROR: CALL_AND_RETRY_LAST Allocation failed - JavaScript heap out of memory
==== JS stack trace =========================================

Security context: 0x3eb77f7257c1 <JSObject>
    1: stringSlice(aka stringSlice) [buffer.js:560] [bytecode=0x55de37cc7f9 offset=94](this=0x14656e9822d1 <undefined>,buf=0xc195ae8ff99 <Uint8Array map = 0x3dda736b6709>,encoding=0x3eb77f734a51 <String[4]: utf8>,start=0,end=1477070)
    2: toString [buffer.js:~609] [pc=0x1b4d2dcba44f](this=0xc195ae8ff99 <Uint8Array map = 0x3dda736b6709>,encoding=0x3eb77f734a51 <String[4]: utf8>,start=0x14656e98...

1: node::Abort() [/opt/node8/bin/node]
2: 0x11e660c [/opt/node8/bin/node]
3: v8::Utils::ReportOOMFailure(char const*, bool) [/opt/node8/bin/node]
4: v8::internal::V8::FatalProcessOutOfMemory(char const*, bool) [/opt/node8/bin/node]
5: v8::internal::Factory::NewRawOneByteString(int, v8::internal::PretenureFlag) [/opt/node8/bin/node]
6: v8::internal::Factory::NewStringFromOneByte(v8::internal::Vector<unsigned char const>, v8::internal::PretenureFlag) [/opt/node8/bin/node]
7: v8::internal::Factory::NewStringFromUtf8(v8::internal::Vector<char const>, v8::internal::PretenureFlag) [/opt/node8/bin/node]
8: v8::String::NewFromUtf8(v8::Isolate*, char const*, v8::NewStringType, int) [/opt/node8/bin/node]
9: node::StringBytes::Encode(v8::Isolate*, char const*, unsigned long, node::encoding, v8::Local<v8::Value>*) [/opt/node8/bin/node]
10: 0x1206086 [/opt/node8/bin/node]
11: v8::internal::FunctionCallbackArguments::Call(void (*)(v8::FunctionCallbackInfo<v8::Value> const&)) [/opt/node8/bin/node]
12: 0xb791cc [/opt/node8/bin/node]
13: v8::internal::Builtin_HandleApiCall(int, v8::internal::Object**, v8::internal::Isolate*) [/opt/node8/bin/node]
14: 0x1b4d2d3042fd
```

#### 现象
[现象1](img/现象1.png)

#### 资料
- 深入浅出Node.js（书籍）
- [Node.js 调试指南](https://www.bookstack.cn/read/node-in-debugging/2.2heapdump.md)
- [轻松排查线上Node内存泄漏问题](https://cnodejs.org/topic/58eb5d378cda07442731569f)
- [JavaScript 中 4 种常见的内存泄露陷阱](http://www.mamicode.com/info-detail-1609988.html)
- [内存术语](https://developers.google.com/web/tools/chrome-devtools/memory-problems/memory-101)
- [一种有趣的JavaScript内存泄漏](https://blog.meteor.com/an-interesting-kind-of-javascript-memory-leak-8b47d2e7f156)
- [内存泄漏](https://github.com/meteor/meteor/issues/1157)
- [偷偷摸摸的V8封盖很有趣（还有利润？）](https://mrale.ph/blog/2012/09/23/grokking-v8-closures-for-fun.html)
- [垃圾回收错误地处理闭包](https://bugs.chromium.org/p/chromium/issues/detail?id=315190)
- [Node应用内存泄漏分析方法论与实战](https://help.aliyun.com/document_detail/64011.html?spm=5176.179584.935963.4.5782276eU84Tz4)
- [记一次惨痛的 Vue SSR 内存泄漏排查](https://juejin.im/post/6844904167534805005)
- [VUE SSR内存泄露解决过程和经验总结](https://developer.aliyun.com/article/682846)
- [vue-ssr服务端渲染透析](https://juejin.im/post/6844904163692937229)
- [ssr：内存和CPU问题](https://github.com/vuejs/vue-router/issues/1706)
- [Vue SSR深度剖析](https://zhuanlan.zhihu.com/p/61348429)
