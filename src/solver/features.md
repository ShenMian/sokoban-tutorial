# 特征(Feature)

除了通过下界计算得到的启发式函数值, 还有一些特征的值可以附加在启发式函数值上, 在确保启发式函数值保持其容许性的前提下, 优先搜索有相同启发式函数值的状态中选择更接近目标状态的节点.

## 归位箱子特征(Packing feature)

即位于目标上的箱子数量. 因为最终状态中的归位箱子数量最大, 因此该特征可以指导搜索.

## 连通性特征(Connectivity feature)

玩家全部可达区域可能会被箱子分割为多个区域. 这些区域的数量越少意味着玩家可以移动的范围越大.

因为区域是被箱子分割的, 因此只需要检测箱子周围的点所属的区域即可获得独立的区域数.
通过判断箱子在割点上的情况快速判断独立区域的数量.

## 房间连通性特征(Room connectivity feature)

## 参考

- [Y. Shoham and J. Schaeffer, "The FESS Algorithm: A Feature Based Approach to Single-Agent Search," 2020 IEEE Conference on Games (CoG), Osaka, Japan, 2020, pp. 96-103, doi: 10.1109/CoG47356.2020.9231929](https://ieeexplore.ieee.org/document/9231929)
