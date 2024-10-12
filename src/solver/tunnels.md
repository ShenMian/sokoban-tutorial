# 隧道(Tunnel)

在有 $n$ 个箱子的关卡中, 每一个状态最多有 $n$ 个子状态. 但如果当前状态是无影响力推动, 那么只需要产生 1 个子状态.

然而有些产生状态的推动对于求解问题并无实质性贡献, 这类推动被称为**无影响力推动**(No influence pushes).

隧道是一种常见的无影响力推动.

如果新的子状态是无影响力推动, 那么应该继续生成该子状态的子状态指导产生有影响力推动的子状态.

当玩家推动箱子后产生以下模式, 则应该往同方向继续推一次.
TODO: 说明原因

TODO: 是否满足容许性?

```txt
###########
#.  $@$  .#
###########
```

TODO: 说明隧道中可以停放一个箱子, 在隧道的入口处, 或出口前. 但应该只停靠在入口处, 因为这样更高效. 说明为何更高效.

若推动后产生了如下的模式, 包括旋转和镜像.

```txt
#$    #$#
#@#   #@#
```

```rs
impl Solver {
    fn calculate_tunnels(&self) -> HashSet<(Vector2<i32>, Direction)> {
        let mut tunnels = HashSet::new();
        for x in 1..self.map.dimensions().x - 1 {
            for y in 1..self.map.dimensions().y - 1 {
                let box_position = Vector2::new(x, y);
                if !self.map[box_position].intersects(Tiles::Floor) {
                    continue;
                }

                for (up, right, down, left) in [
                    Direction::Up,
                    Direction::Right,
                    Direction::Down,
                    Direction::Left,
                ]
                .into_iter()
                .circular_tuple_windows()
                {
                    let player_position = box_position + &down.into();

                    //  .
                    // #$#
                    // #@#
                    if self.map[player_position + &left.into()].intersects(Tiles::Wall)
                        && self.map[player_position + &right.into()].intersects(Tiles::Wall)
                        && self.map[box_position + &left.into()].intersects(Tiles::Wall)
                        && self.map[box_position + &right.into()].intersects(Tiles::Wall)
                        && self.map[box_position].intersects(Tiles::Floor)
                        && self
                            .lower_bounds()
                            .contains_key(&(box_position + &up.into()))
                        && !self.map[box_position].intersects(Tiles::Goal)
                    {
                        tunnels.insert((player_position, up));
                    }

                    //  .      .
                    // #$_ or _$#
                    // #@#    #@#
                    if self.map[player_position + &left.into()].intersects(Tiles::Wall)
                        && self.map[player_position + &right.into()].intersects(Tiles::Wall)
                        && (self.map[box_position + &right.into()].intersects(Tiles::Wall)
                            && self.map[box_position + &left.into()].intersects(Tiles::Floor)
                            || self.map[box_position + &right.into()].intersects(Tiles::Floor)
                                && self.map[box_position + &left.into()].intersects(Tiles::Wall))
                        && self.map[box_position].intersects(Tiles::Floor)
                        && self
                            .lower_bounds()
                            .contains_key(&(box_position + &up.into()))
                        && !self.map[box_position].intersects(Tiles::Goal)
                    {
                        tunnels.insert((player_position, up));
                    }
                }
            }
        }
        tunnels
    }

    // ... SKIP...
}
```
