## 动态规划
算法设计的一种方法

讲一个问题分解为相互重叠的子问题，通过反复求解子问题，来解决原来的问题。

什么叫相互重叠 斐波那契数列

子问题是独立就是分而治之
重叠的就是动态规划


leetcode：70 爬楼梯 
初印象：就是斐波那契数列
解题步骤
定义子问题：F(n)=F(n-1)+F(n-2)
反复执行；从2循环到n，执行上述公式.

思考：
1. 原来动态规划不一定是在求最优解，也可以是通过节省重复子问题的求解来达到缩短时间复杂度。
2. 动态规划的子问题方式的公式很重要。
3. 空间复杂度也可以有进化空间

leetcode：198 打家劫舍 
初印象：最优解问题 ，无法用贪心算法，可以用回溯
解题步骤
子问题：f（k）= max( f(k-2)+ak , f(k-1) );
反复执行

思考：
1. 这个规律找到，问题就搞定了
2. 子问题公式就是每一步的最优解公式
3. 每一步找最优解。相信既定基础是最优解



总结：
动态规划是算法设计中的一种方法
相互重叠的子问题，反复求解。相信和基于原有阶段最优解。

步骤
定义子问题
反复执行求解
