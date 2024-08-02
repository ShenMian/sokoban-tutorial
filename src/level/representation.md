# 表示

## 表示地图 🗺️

### 元素的表示

地图共包含 5 种元素, 这些元素可能在一个格子内叠加(比如玩家位于目标上).  
最小的数据存储单元字节包含 8 个比特, 足以表示 5 种元素. 因此可以使用一个字节的空间来存储单个地图格子, 其中的每个比特表示一种地图元素.  
创建用于表示地图元素的标志位(bit flags):

```rs
use bitflags::bitflags;

bitflags! {
    pub struct Tiles: u8 {
        const Floor = 1 << 0;
        const Wall = 1 << 1;
        const Box = 1 << 2;
        const Goal = 1 << 3;
        const Player = 1 << 4;
    }
}
```

这样可以很方便的表示多种地图元素叠加的情况, 如使用 `Tiles::Floor | Tiles::Goal | Tiles::Player` 来表示玩家位于目标上, 而目标位于地板上的情况.  
利用比特位表示元素不仅使得判断元素是否存在、添加或移除某个元素等操作变得非常便捷, 而且还有位运算带来的性能上的优势.

### 地图的存储

使用一维数组来存储地图数据, 使用二维向量(数学)存储地图尺寸.

```rs
use nalgebra::Vector2;

pub struct Map {
    data: Vec<Tiles>,
    dimensions: Vector2<i32>,
    // ... SKIP ...
}
```

这样设计有以下考量:

1. 与拥有固定尺寸棋盘的棋类游戏不同, 推箱子关卡的尺寸是可变的, 因此使用动态数组.
2. 使用一维数组而非二维数组 (`Vec<Vec<Tiles>>`) 是因为一维数组更平坦(flatten), 能确保动态数组的元素在内存中是紧密排列的, 根据数据局部性原理, 这通常能提高内存读取效率. 此外, 由于结构更为简单, 使得部分操作的代码更为简洁高效, 比如调整地图尺寸.

但这也意味着通过二维坐标访问地图元素需要手动计算一维数组中对应的下标, 可以通过以下方式实现:

```rs
impl Index<Vector2<i32>> for Map {
    type Output = Tiles;

    fn index(&self, position: Vector2<i32>) -> &Tiles {
        assert!(0 <= position.x && position.x < self.dimensions.x && 0 <= position.y);
        &self.data[(position.y * self.dimensions.x + position.x) as usize]
    }
}

impl IndexMut<Vector2<i32>> for Map {
    fn index_mut(&mut self, position: Vector2<i32>) -> &mut Tiles {
        assert!(0 <= position.x && position.x < self.dimensions.x && 0 <= position.y);
        &mut self.data[(position.y * self.dimensions.x + position.x) as usize]
    }
}
```

这样便可以直接通过二维坐标访问地图元素, 例如访问地图 $(1, 1)$ 位置的元素: `map[Vector2::new(1, 1)]`.  
这样的设计不仅可以享受了二维数组访问方式的便捷性, 还能保留了一维数组带来的性能优势.

值得注意的是其中的断言, 该函数最终通过下标访问一维数组由 `Index<> for Vec<>` 进行了部分越界检查, 但越界检查依然不完整, 没有涵盖以下无效情况:

1. 坐标 `x` 可以超出地图宽度的情况, 但其一维数组下标依然有效.
2. 坐标 `x`, `y` 中存在负数, 但其一维数组下标依然可能是正数.

## 表示关卡

关卡数据可分为三个部分: 地图数据, 元数据和注释. 其中注释可以作为元数据.  
元数据是一个键值对的集合, 且键不重复, 因此可以使用 `HashMap` 容器来存储.
可以使用下面的结构体存储关卡数据:

```rs
use std::collections::HashMap;

pub struct Level {
    map: Map,
    metadata: HashMap<String, String>,
    // ... SKIP ...
}
```

将地图从关卡中拆分是因为地图涉及大量的关联函数, 如果都放在 `Level` 里会导致其变得过于庞大.  
为了提升代码的可读性和可维护性, 将相关代码拆分到 `Map` 中, 并通过实现 `Deref` trait, 使得用户能够透明地引用到 `Level` 内部的 `Map`.
