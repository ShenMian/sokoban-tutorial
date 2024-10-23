# 启发式函数(Heuristic function)

启发式函数用于指导搜索算法的搜索方向.

A* 算法的核心是估价函数 $f$, $f(n)=g(n)+h(n)$. 其中:

- $n$ 是某个状态.
- $g(n)$ 为从初始状态到 $n$ 状态的**实际**代价.
- $h(n)$ 为从 $n$ 状态到目标状态的代价的**估计**代价.

搜索最短路径就是指搜索总代价(即 $f$ 的函数值)最小的路径. 以推箱子为例:

- 代价可能指玩家移动数, 也可能指箱子推动数, 这取决于求解器的搜索策略. 因此针对不同的搜索策略, 于代价相关的函数 $g$ 和 $h$ 的实现不同.
- 路径就是解决方案.

该算法总是能搜索到最优路径, 前提是启发式函数 $h$ 满足容许性(Admissible)[^1].

## 容许性(Admissible)

启发式函数满足容许性, 才能确保结果是最优的. 若函数 $h$ 满足以下条件则满足容许性:

$$
\forall n,h(n) \leq h^*(n)
$$

其中 $h^*(n)$ 是从 $n$ 状态到目标状态的**实际**代价.

对于最优路径上的任意状态 $m$, 到目标状态的**实际**代价总是为 $h^*(m)$. 若 $h(n) > h^*(n)$, 在搜索 $g$ 函数值相同的节点时, 一定会跳过最优路径, 进而返回非最优路径.  
函数 $h$ 不满足容许性也可能返回最优路径, 因为 $h(n) > h^*(n)$ 不一定恒成立.

## 设计的方向

假设 $h(n) = 0$, 此时函数 $h$ 满足容许性, 但不再能启发搜索方向, 该情况下的 A* 算法也被称之为相同代价搜索(Uniform-cost search, UCS), 下一个搜索节点的优先级为 $f(n) = g(n)$, 行为与 BFS **类似**. 虽然可以得到最优解, 但无法得到 "启发式" 带来的任何的优化.  
理想状态下 $h(n) = h^*(n)$, 但这**不可能**. 因此函数 $h$ 应该在满足容许性的前提下, 尽可能的接近 $h^*(n)$.

---

对于网格上的寻路算法, 一种启发式函数的实现是计算当前位置和目标位置之间的曼哈顿距离. 相比之下, 推箱子的启发式函数实现并不那么显而易见.  
理想状态下, 函数 $h$ 对于任意关卡的任意解决方案 $n_1, n_2, ... , n_k$, 应满足以下条件:

- $h(n_i) > h(n_{i+1})$
- $h(n_1) = 0$
- $h(n_k) = h^*(n_k)$

## 预计算

启发式函数计算的适合通常会假设地图上只有一个箱子, 因为这样计算出的结果与箱子的位置无关. 在搜索状态的时候箱子的位置会不断发生改变, 但是启发式函数的值不变.  
因此可以提前计启发式函数的值, 供后续搜索时使用.

## 下界(Lower bounds)

根据搜索策略有两种下界:

- **推动下界**: 将箱子推动到任何目标的最少**推动**数.
- **移动下界**: 将箱子推动到任何目标的最少**移动**数.

其中推动下界可以用于搜索最优移动数解决方案, 反之则不行. 因为推动下界一定小于移动下界.

最简单的推动下界计算方法是计算每个箱子到最近目标的曼哈顿距离[^2]. 曼哈顿距离也是网格中寻路常用的启发式函数的计算方法.

TODO: 使用二维数组而非 HashMap 来存储下界.

```rs
fn manhattan_distance(a: Vector2<i32>, b: Vector2<i32>) -> u32 {
    (a.x - b.x).abs() + (a.y - b.y).abs()
}

let mut lower_bounds = HashMap::new();
for x in 1..self.map.dimensions().x - 1 {
    for y in 1..self.map.dimensions().y - 1 {
        let position = Vector2::new(x, y);
        if self.level[position].intersects(Tiles::Goal) {
            lower_bounds.insert(position, 0);
            continue;
        }
        if !self.map[position].intersects(Tiles::Floor) {
            continue;
        }
        let lower_bound = self
            .map
            .goal_positions()
            .iter()
            .map(|box_position| manhattan_distance(*box_position, &position))
            .min()
            .unwrap(); // 地图上的目标不可能为空 => 迭代器不可能为空 => `Iterator::min` 不可能返回 `None`
        lower_bounds.insert(position, lower_bound);
    }
}
lower_bounds
```

上面算法的时间复杂度为 $O(n * m  * k)$, 其中 $n$, $m$ 为地图尺寸, $k$ 为目标数量.  
其中函数 `manhattan_distance` 的时间复杂度为 $O(1)$.

该方法的有点是计算十分快速, 缺点是其忽视了墙体对玩家和箱子的阻碍, 可能严重低估了推动下界.

## 实现

启发式函数需要计算当前状态到目标状态的下界.  
所有箱子所在位置的下界之和.

```rs
impl State {
    fn calculate_lower_bound(&self, solver: &Solver) -> usize {
        self.box_positions
            .iter()
            .map(|box_position| solver.lower_bounds()[&box_position])
            .sum()
    }
    // ... SKIP ...
}
```

[^1]: <https://en.wikipedia.org/wiki/Admissible_heuristic>
[^2]: <https://simple.wikipedia.org/wiki/Manhattan_distance>
