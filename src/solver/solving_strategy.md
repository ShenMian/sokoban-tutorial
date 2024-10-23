# 搜索策略

## 什么是最短路径?

在常见的寻路算法中, **最短**可能是指距离最短, 也可能是指时间最短.  
在推箱子中也是如此, 既有移动数最优解决方案, 也有推动数最优解决方案.

## 策略

推箱子求解器通常有以下策略:

- `Fast`: A* 算法可以用于搜索最短路径, 但不一定只能搜索最短路径. 通过提高启发式函数的权重可以提高搜索到任何解决方案的效率, 即**速度**.
- `OptimalPush`: 搜索**推动数**最少的解决方案.
- `OptimalMove`: 搜索**移动数**最少的解决方案.
- 搜索**推动数**最少其次**移动数**最少的解决方案.
- 搜索**移动数**最少其次**推动数**最少的解决方案.

## 表示

```rs
pub enum Strategy {
    /// Search for any solution as quickly as possible
    Fast,

    /// Find the push optimal solution
    OptimalPush,

    /// Find the move optimal solution
    OptimalMove,
}
```
