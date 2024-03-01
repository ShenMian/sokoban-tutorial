Object.assign(window.search, {"doc_urls":["introduction.html#介绍","level/index.html#关卡","level/index.html#表示地图","level/index.html#表示关卡","level/index.html#行程编码run-length-encoding","level/parse.html#解析","level/parse.html#单个关卡解析","level/parse.html#多个关卡解析","level/normalization.html#标准化","level/normalization.html#激进的标准化"],"index":{"documentStore":{"docInfo":{"0":{"body":1,"breadcrumbs":0,"title":0},"1":{"body":38,"breadcrumbs":0,"title":0},"2":{"body":54,"breadcrumbs":0,"title":0},"3":{"body":10,"breadcrumbs":0,"title":0},"4":{"body":12,"breadcrumbs":3,"title":3},"5":{"body":0,"breadcrumbs":0,"title":0},"6":{"body":0,"breadcrumbs":0,"title":0},"7":{"body":0,"breadcrumbs":0,"title":0},"8":{"body":1,"breadcrumbs":0,"title":0},"9":{"body":0,"breadcrumbs":0,"title":0}},"docs":{"0":{"body":"本文将描述如何实现一个推箱子游戏, 代码示例使用 Rust 语言编写. 推箱子游戏具有以下特点: 规则简单. 可以专注于实现功能, 而非理解复杂的游戏规则和机制. 基本功能易于实现. 有具有挑战的高级功能. 比如纯鼠标控制(也称为点推), 逆推等. 有需要深入钻研的求解器, 用于自动求解推箱子关卡. 本文将由浅入深的介绍上面功能并提供实现的思路.","breadcrumbs":"介绍 » 介绍","id":"0","title":"介绍"},"1":{"body":"推箱子关卡使用最广泛的格式为 XSB, 最初由 XSokoban 所使用. 该格式使用 ASCII 字符来表示地图元素, 支持注释和附加元数据. 以关卡 Boxworld #1 为例: 其 XSB 格式关卡的数据如下: ;Level 1\n__###___\n__#.#___\n__#-####\n###$-$.#\n#.-$@###\n####$#__\n___#.#__\n___###__\nTitle: Boxworld 1\nAuthor: Thinking Rabbit 第 1 行, 以 ; 开头的单行注释. 第 2-9 行, 使用 ASCII 字符表示的地图数据. 第 10-11 行, 包括关卡标题和作者的元数据. ASCII 符号 描述 <SPACE>/-/_ Floor # Wall $ Box . Goal @ Player + Player on goal * Box on goal","breadcrumbs":"关卡 » 关卡","id":"1","title":"关卡"},"2":{"body":"地图共包含 5 种元素, 其中部分元素可能叠加(比如玩家位于目标上). 因此可以使用比特位来表示地图中的每个格子包含哪些元素. 创建用于表示地图元素的比特位: use bitflags::bitflags; bitflags! { pub struct Tiles: u8 { const Floor = 1 << 0; const Wall = 1 << 1; const Box = 1 << 2; const Goal = 1 << 3; const Player = 1 << 4; }\n} 使用一维数组来存储地图数据并使用二维向量存储地图尺寸. use nalgebra::Vector2; pub struct Map { data: Vec<Tiles>, dimensions: Vector2<i32>, // ... SKIP ...\n} 使用一维数组而非二维数组是因为一维数组更平坦, 进行部分操作时更简单高效: impl Map { pub fn with_dimensions(dimensions: Vector2<i32>) -> Self { Self { data: vec![Tiles::empty(); (dimensions.x * dimensions.y) as usize], dimensions, // ... SKIP ... } } // ... SKIP ...\n}","breadcrumbs":"关卡 » 表示地图","id":"2","title":"表示地图"},"3":{"body":"关卡数据可分为三个部分: 地图数据, 元数据和注释. 其中注释可以作为元数据. 元数据是一个键值对的集合, 因此可以使用 HashMap 来存储. 可以使用下面的结构体存储关卡数据: pub struct Level { map: Map, metadata: HashMap<String, String>, // ... SKIP ...\n}","breadcrumbs":"关卡 » 表示关卡","id":"3","title":"表示关卡"},"4":{"body":"行程编码(Run length encoding, RLE)经常被用于压缩推箱子的关卡和解决方案. ###\n#.###\n#*$ #\n# @ #\n##### 经 RLE 编码后可得: 3#\n#.3#\n#*$-#\n#--@#\n5# 可以看出, 虽然编码后的关卡有更小的体积, 但不再能直观地看出关卡的结构. RLE 编码后的关卡通常还会使用 | 来分割行, 而非 \\n. 使其看上去更加紧凑: 3#|#.3#|#*$-#|#--@#|5#","breadcrumbs":"关卡 » 行程编码(Run length encoding)","id":"4","title":"行程编码(Run length encoding)"},"5":{"body":"","breadcrumbs":"关卡 » 解析 » 解析","id":"5","title":"解析"},"6":{"body":"","breadcrumbs":"关卡 » 解析 » 单个关卡解析","id":"6","title":"单个关卡解析"},"7":{"body":"","breadcrumbs":"关卡 » 解析 » 多个关卡解析","id":"7","title":"多个关卡解析"},"8":{"body":"TODO","breadcrumbs":"关卡 » 标准化 » 标准化","id":"8","title":"标准化"},"9":{"body":"激进的标准化可能改变关卡的解. 以最简单的关卡为例: #####\n#@$.#\n##### 因为玩家开始的位置三面有墙, 位于死胡同, 只能向右移动. 得到结果: #####\n# @*#\n##### 玩家左侧死胡同属于无用的区域, 使用墙体填充. 玩家右侧位于目标上的箱子处于死锁状态, 属于无用的箱子和目标, 使用墙体填充. 最后去除多余的墙体得到激进的标准化结果: ###\n#@#\n### 这是一个最简单的非标准关卡, 因为其没有箱子和目标, 解为空.","breadcrumbs":"关卡 » 标准化 » 激进的标准化","id":"9","title":"激进的标准化"}},"length":10,"save":true},"fields":["title","body","breadcrumbs"],"index":{"body":{"root":{"0":{"df":1,"docs":{"2":{"tf":1.0}}},"1":{"0":{"df":1,"docs":{"1":{"tf":1.0}}},"1":{"df":1,"docs":{"1":{"tf":1.0}}},"df":2,"docs":{"1":{"tf":2.0},"2":{"tf":2.449489742783178}}},"2":{"df":2,"docs":{"1":{"tf":1.0},"2":{"tf":1.0}}},"3":{"#":{"df":0,"docs":{},"|":{"#":{".":{"3":{"df":1,"docs":{"4":{"tf":1.0}}},"df":0,"docs":{}},"df":0,"docs":{}},"df":0,"docs":{}}},"df":2,"docs":{"2":{"tf":1.0},"4":{"tf":1.4142135623730951}}},"4":{"df":1,"docs":{"2":{"tf":1.0}}},"5":{"df":2,"docs":{"2":{"tf":1.0},"4":{"tf":1.4142135623730951}}},"9":{"df":1,"docs":{"1":{"tf":1.0}}},"_":{"_":{"#":{"#":{"#":{"_":{"_":{"_":{"df":1,"docs":{"1":{"tf":1.0}}},"df":0,"docs":{}},"df":0,"docs":{}},"df":0,"docs":{}},"df":0,"docs":{}},".":{"#":{"_":{"_":{"_":{"df":1,"docs":{"1":{"tf":1.0}}},"df":0,"docs":{}},"df":0,"docs":{}},"df":0,"docs":{}},"df":0,"docs":{}},"df":0,"docs":{}},"_":{"#":{"#":{"#":{"_":{"_":{"df":1,"docs":{"1":{"tf":1.0}}},"df":0,"docs":{}},"df":0,"docs":{}},"df":0,"docs":{}},".":{"#":{"_":{"_":{"df":1,"docs":{"1":{"tf":1.0}}},"df":0,"docs":{}},"df":0,"docs":{}},"df":0,"docs":{}},"df":0,"docs":{}},"df":0,"docs":{}},"df":1,"docs":{"1":{"tf":1.4142135623730951}}},"df":1,"docs":{"1":{"tf":1.0}}},"a":{"df":0,"docs":{},"s":{"c":{"df":0,"docs":{},"i":{"df":0,"docs":{},"i":{"df":1,"docs":{"1":{"tf":1.7320508075688772}}}}},"df":0,"docs":{}},"u":{"df":0,"docs":{},"t":{"df":0,"docs":{},"h":{"df":0,"docs":{},"o":{"df":0,"docs":{},"r":{"df":1,"docs":{"1":{"tf":1.0}}}}}}}},"b":{"df":0,"docs":{},"i":{"df":0,"docs":{},"t":{"df":0,"docs":{},"f":{"df":0,"docs":{},"l":{"a":{"df":0,"docs":{},"g":{"df":1,"docs":{"2":{"tf":1.0}},"s":{":":{":":{"b":{"df":0,"docs":{},"i":{"df":0,"docs":{},"t":{"df":0,"docs":{},"f":{"df":0,"docs":{},"l":{"a":{"df":0,"docs":{},"g":{"df":1,"docs":{"2":{"tf":1.0}}}},"df":0,"docs":{}}}}}},"df":0,"docs":{}},"df":0,"docs":{}},"df":0,"docs":{}}}},"df":0,"docs":{}}}}},"o":{"df":0,"docs":{},"x":{"df":2,"docs":{"1":{"tf":1.4142135623730951},"2":{"tf":1.0}},"w":{"df":0,"docs":{},"o":{"df":0,"docs":{},"r":{"df":0,"docs":{},"l":{"d":{"df":1,"docs":{"1":{"tf":1.4142135623730951}}},"df":0,"docs":{}}}}}}}},"c":{"df":0,"docs":{},"o":{"df":0,"docs":{},"n":{"df":0,"docs":{},"s":{"df":0,"docs":{},"t":{"df":1,"docs":{"2":{"tf":2.23606797749979}}}}}}},"d":{"a":{"df":0,"docs":{},"t":{"a":{"df":1,"docs":{"2":{"tf":1.4142135623730951}}},"df":0,"docs":{}}},"df":0,"docs":{},"i":{"df":0,"docs":{},"m":{"df":0,"docs":{},"e":{"df":0,"docs":{},"n":{"df":0,"docs":{},"s":{"df":1,"docs":{"2":{"tf":1.4142135623730951}},"i":{"df":0,"docs":{},"o":{"df":0,"docs":{},"n":{"df":0,"docs":{},"s":{".":{"df":0,"docs":{},"i":{"df":1,"docs":{"2":{"tf":1.0}}},"x":{"df":1,"docs":{"2":{"tf":1.0}}}},"df":0,"docs":{}}}}}}}}}}},"df":0,"docs":{},"e":{"df":0,"docs":{},"n":{"c":{"df":0,"docs":{},"o":{"d":{"df":1,"docs":{"4":{"tf":1.4142135623730951}}},"df":0,"docs":{}}},"df":0,"docs":{}}},"f":{"df":0,"docs":{},"l":{"df":0,"docs":{},"o":{"df":0,"docs":{},"o":{"df":0,"docs":{},"r":{"df":2,"docs":{"1":{"tf":1.0},"2":{"tf":1.0}}}}}},"n":{"df":1,"docs":{"2":{"tf":1.0}}}},"g":{"df":0,"docs":{},"o":{"a":{"df":0,"docs":{},"l":{"df":2,"docs":{"1":{"tf":1.7320508075688772},"2":{"tf":1.0}}}},"df":0,"docs":{}}},"h":{"a":{"df":0,"docs":{},"s":{"df":0,"docs":{},"h":{"df":0,"docs":{},"m":{"a":{"df":0,"docs":{},"p":{"<":{"df":0,"docs":{},"s":{"df":0,"docs":{},"t":{"df":0,"docs":{},"r":{"df":1,"docs":{"3":{"tf":1.0}}}}}},"df":1,"docs":{"3":{"tf":1.0}}}},"df":0,"docs":{}}}}},"df":0,"docs":{}},"i":{"df":0,"docs":{},"m":{"df":0,"docs":{},"p":{"df":0,"docs":{},"l":{"df":1,"docs":{"2":{"tf":1.0}}}}}},"l":{"df":0,"docs":{},"e":{"df":0,"docs":{},"n":{"df":0,"docs":{},"g":{"df":0,"docs":{},"t":{"df":0,"docs":{},"h":{"df":1,"docs":{"4":{"tf":1.4142135623730951}}}}}},"v":{"df":0,"docs":{},"e":{"df":0,"docs":{},"l":{"df":2,"docs":{"1":{"tf":1.0},"3":{"tf":1.0}}}}}}},"m":{"a":{"df":0,"docs":{},"p":{"df":2,"docs":{"2":{"tf":1.4142135623730951},"3":{"tf":1.4142135623730951}}}},"df":0,"docs":{},"e":{"df":0,"docs":{},"t":{"a":{"d":{"a":{"df":0,"docs":{},"t":{"a":{"df":1,"docs":{"3":{"tf":1.0}}},"df":0,"docs":{}}},"df":0,"docs":{}},"df":0,"docs":{}},"df":0,"docs":{}}}},"n":{"a":{"df":0,"docs":{},"l":{"df":0,"docs":{},"g":{"df":0,"docs":{},"e":{"b":{"df":0,"docs":{},"r":{"a":{":":{":":{"df":0,"docs":{},"v":{"df":0,"docs":{},"e":{"c":{"df":0,"docs":{},"t":{"df":0,"docs":{},"o":{"df":0,"docs":{},"r":{"2":{"df":1,"docs":{"2":{"tf":1.0}}},"df":0,"docs":{}}}}},"df":0,"docs":{}}}},"df":0,"docs":{}},"df":0,"docs":{}},"df":0,"docs":{}}},"df":0,"docs":{}}}}},"df":1,"docs":{"4":{"tf":1.0}}},"p":{"df":0,"docs":{},"l":{"a":{"df":0,"docs":{},"y":{"df":0,"docs":{},"e":{"df":0,"docs":{},"r":{"df":2,"docs":{"1":{"tf":1.4142135623730951},"2":{"tf":1.0}}}}}},"df":0,"docs":{}},"u":{"b":{"df":2,"docs":{"2":{"tf":1.7320508075688772},"3":{"tf":1.0}}},"df":0,"docs":{}}},"r":{"a":{"b":{"b":{"df":0,"docs":{},"i":{"df":0,"docs":{},"t":{"df":1,"docs":{"1":{"tf":1.0}}}}},"df":0,"docs":{}},"df":0,"docs":{}},"df":0,"docs":{},"l":{"df":0,"docs":{},"e":{"df":1,"docs":{"4":{"tf":1.7320508075688772}}}},"u":{"df":0,"docs":{},"n":{"df":1,"docs":{"4":{"tf":1.4142135623730951}}},"s":{"df":0,"docs":{},"t":{"df":1,"docs":{"0":{"tf":1.0}}}}}},"s":{"df":0,"docs":{},"e":{"df":0,"docs":{},"l":{"df":0,"docs":{},"f":{"df":1,"docs":{"2":{"tf":1.4142135623730951}}}}},"k":{"df":0,"docs":{},"i":{"df":0,"docs":{},"p":{"df":2,"docs":{"2":{"tf":1.7320508075688772},"3":{"tf":1.0}}}}},"p":{"a":{"c":{"df":0,"docs":{},"e":{"df":1,"docs":{"1":{"tf":1.0}}}},"df":0,"docs":{}},"df":0,"docs":{}},"t":{"df":0,"docs":{},"r":{"df":0,"docs":{},"i":{"df":0,"docs":{},"n":{"df":0,"docs":{},"g":{"df":1,"docs":{"3":{"tf":1.0}}}}},"u":{"c":{"df":0,"docs":{},"t":{"df":2,"docs":{"2":{"tf":1.4142135623730951},"3":{"tf":1.0}}}},"df":0,"docs":{}}}}},"t":{"df":0,"docs":{},"h":{"df":0,"docs":{},"i":{"df":0,"docs":{},"n":{"df":0,"docs":{},"k":{"df":1,"docs":{"1":{"tf":1.0}}}}}},"i":{"df":0,"docs":{},"l":{"df":0,"docs":{},"e":{"df":1,"docs":{"2":{"tf":1.0}}}},"t":{"df":0,"docs":{},"l":{"df":1,"docs":{"1":{"tf":1.0}}}}},"o":{"d":{"df":0,"docs":{},"o":{"df":1,"docs":{"8":{"tf":1.0}}}},"df":0,"docs":{}}},"u":{"8":{"df":1,"docs":{"2":{"tf":1.0}}},"df":0,"docs":{},"s":{"df":1,"docs":{"2":{"tf":1.4142135623730951}},"i":{"df":0,"docs":{},"z":{"df":1,"docs":{"2":{"tf":1.0}}}}}},"v":{"df":0,"docs":{},"e":{"c":{"!":{"[":{"df":0,"docs":{},"t":{"df":0,"docs":{},"i":{"df":0,"docs":{},"l":{"df":0,"docs":{},"e":{"df":0,"docs":{},"s":{":":{":":{"df":0,"docs":{},"e":{"df":0,"docs":{},"m":{"df":0,"docs":{},"p":{"df":0,"docs":{},"t":{"df":0,"docs":{},"i":{"df":1,"docs":{"2":{"tf":1.0}}}}}}}},"df":0,"docs":{}},"df":0,"docs":{}}}}}}},"df":0,"docs":{}},"<":{"df":0,"docs":{},"t":{"df":0,"docs":{},"i":{"df":0,"docs":{},"l":{"df":1,"docs":{"2":{"tf":1.0}}}}}},"df":0,"docs":{},"t":{"df":0,"docs":{},"o":{"df":0,"docs":{},"r":{"2":{"<":{"df":0,"docs":{},"i":{"3":{"2":{"df":1,"docs":{"2":{"tf":1.4142135623730951}}},"df":0,"docs":{}},"df":0,"docs":{}}},"df":0,"docs":{}},"df":0,"docs":{}}}}},"df":0,"docs":{}}},"w":{"a":{"df":0,"docs":{},"l":{"df":0,"docs":{},"l":{"df":2,"docs":{"1":{"tf":1.0},"2":{"tf":1.0}}}}},"df":0,"docs":{},"i":{"df":0,"docs":{},"t":{"df":0,"docs":{},"h":{"_":{"d":{"df":0,"docs":{},"i":{"df":0,"docs":{},"m":{"df":0,"docs":{},"e":{"df":0,"docs":{},"n":{"df":0,"docs":{},"s":{"df":0,"docs":{},"i":{"df":0,"docs":{},"o":{"df":0,"docs":{},"n":{"df":0,"docs":{},"s":{"(":{"d":{"df":0,"docs":{},"i":{"df":0,"docs":{},"m":{"df":0,"docs":{},"e":{"df":0,"docs":{},"n":{"df":0,"docs":{},"s":{"df":1,"docs":{"2":{"tf":1.0}}}}}}}},"df":0,"docs":{}},"df":0,"docs":{}}}}}}}}}}},"df":0,"docs":{}},"df":0,"docs":{}}}}},"x":{"df":0,"docs":{},"s":{"b":{"df":1,"docs":{"1":{"tf":1.4142135623730951}}},"df":0,"docs":{},"o":{"df":0,"docs":{},"k":{"df":0,"docs":{},"o":{"b":{"a":{"df":0,"docs":{},"n":{"df":1,"docs":{"1":{"tf":1.0}}}},"df":0,"docs":{}},"df":0,"docs":{}}}}}}}},"breadcrumbs":{"root":{"0":{"df":1,"docs":{"2":{"tf":1.0}}},"1":{"0":{"df":1,"docs":{"1":{"tf":1.0}}},"1":{"df":1,"docs":{"1":{"tf":1.0}}},"df":2,"docs":{"1":{"tf":2.0},"2":{"tf":2.449489742783178}}},"2":{"df":2,"docs":{"1":{"tf":1.0},"2":{"tf":1.0}}},"3":{"#":{"df":0,"docs":{},"|":{"#":{".":{"3":{"df":1,"docs":{"4":{"tf":1.0}}},"df":0,"docs":{}},"df":0,"docs":{}},"df":0,"docs":{}}},"df":2,"docs":{"2":{"tf":1.0},"4":{"tf":1.4142135623730951}}},"4":{"df":1,"docs":{"2":{"tf":1.0}}},"5":{"df":2,"docs":{"2":{"tf":1.0},"4":{"tf":1.4142135623730951}}},"9":{"df":1,"docs":{"1":{"tf":1.0}}},"_":{"_":{"#":{"#":{"#":{"_":{"_":{"_":{"df":1,"docs":{"1":{"tf":1.0}}},"df":0,"docs":{}},"df":0,"docs":{}},"df":0,"docs":{}},"df":0,"docs":{}},".":{"#":{"_":{"_":{"_":{"df":1,"docs":{"1":{"tf":1.0}}},"df":0,"docs":{}},"df":0,"docs":{}},"df":0,"docs":{}},"df":0,"docs":{}},"df":0,"docs":{}},"_":{"#":{"#":{"#":{"_":{"_":{"df":1,"docs":{"1":{"tf":1.0}}},"df":0,"docs":{}},"df":0,"docs":{}},"df":0,"docs":{}},".":{"#":{"_":{"_":{"df":1,"docs":{"1":{"tf":1.0}}},"df":0,"docs":{}},"df":0,"docs":{}},"df":0,"docs":{}},"df":0,"docs":{}},"df":0,"docs":{}},"df":1,"docs":{"1":{"tf":1.4142135623730951}}},"df":1,"docs":{"1":{"tf":1.0}}},"a":{"df":0,"docs":{},"s":{"c":{"df":0,"docs":{},"i":{"df":0,"docs":{},"i":{"df":1,"docs":{"1":{"tf":1.7320508075688772}}}}},"df":0,"docs":{}},"u":{"df":0,"docs":{},"t":{"df":0,"docs":{},"h":{"df":0,"docs":{},"o":{"df":0,"docs":{},"r":{"df":1,"docs":{"1":{"tf":1.0}}}}}}}},"b":{"df":0,"docs":{},"i":{"df":0,"docs":{},"t":{"df":0,"docs":{},"f":{"df":0,"docs":{},"l":{"a":{"df":0,"docs":{},"g":{"df":1,"docs":{"2":{"tf":1.0}},"s":{":":{":":{"b":{"df":0,"docs":{},"i":{"df":0,"docs":{},"t":{"df":0,"docs":{},"f":{"df":0,"docs":{},"l":{"a":{"df":0,"docs":{},"g":{"df":1,"docs":{"2":{"tf":1.0}}}},"df":0,"docs":{}}}}}},"df":0,"docs":{}},"df":0,"docs":{}},"df":0,"docs":{}}}},"df":0,"docs":{}}}}},"o":{"df":0,"docs":{},"x":{"df":2,"docs":{"1":{"tf":1.4142135623730951},"2":{"tf":1.0}},"w":{"df":0,"docs":{},"o":{"df":0,"docs":{},"r":{"df":0,"docs":{},"l":{"d":{"df":1,"docs":{"1":{"tf":1.4142135623730951}}},"df":0,"docs":{}}}}}}}},"c":{"df":0,"docs":{},"o":{"df":0,"docs":{},"n":{"df":0,"docs":{},"s":{"df":0,"docs":{},"t":{"df":1,"docs":{"2":{"tf":2.23606797749979}}}}}}},"d":{"a":{"df":0,"docs":{},"t":{"a":{"df":1,"docs":{"2":{"tf":1.4142135623730951}}},"df":0,"docs":{}}},"df":0,"docs":{},"i":{"df":0,"docs":{},"m":{"df":0,"docs":{},"e":{"df":0,"docs":{},"n":{"df":0,"docs":{},"s":{"df":1,"docs":{"2":{"tf":1.4142135623730951}},"i":{"df":0,"docs":{},"o":{"df":0,"docs":{},"n":{"df":0,"docs":{},"s":{".":{"df":0,"docs":{},"i":{"df":1,"docs":{"2":{"tf":1.0}}},"x":{"df":1,"docs":{"2":{"tf":1.0}}}},"df":0,"docs":{}}}}}}}}}}},"df":0,"docs":{},"e":{"df":0,"docs":{},"n":{"c":{"df":0,"docs":{},"o":{"d":{"df":1,"docs":{"4":{"tf":1.7320508075688772}}},"df":0,"docs":{}}},"df":0,"docs":{}}},"f":{"df":0,"docs":{},"l":{"df":0,"docs":{},"o":{"df":0,"docs":{},"o":{"df":0,"docs":{},"r":{"df":2,"docs":{"1":{"tf":1.0},"2":{"tf":1.0}}}}}},"n":{"df":1,"docs":{"2":{"tf":1.0}}}},"g":{"df":0,"docs":{},"o":{"a":{"df":0,"docs":{},"l":{"df":2,"docs":{"1":{"tf":1.7320508075688772},"2":{"tf":1.0}}}},"df":0,"docs":{}}},"h":{"a":{"df":0,"docs":{},"s":{"df":0,"docs":{},"h":{"df":0,"docs":{},"m":{"a":{"df":0,"docs":{},"p":{"<":{"df":0,"docs":{},"s":{"df":0,"docs":{},"t":{"df":0,"docs":{},"r":{"df":1,"docs":{"3":{"tf":1.0}}}}}},"df":1,"docs":{"3":{"tf":1.0}}}},"df":0,"docs":{}}}}},"df":0,"docs":{}},"i":{"df":0,"docs":{},"m":{"df":0,"docs":{},"p":{"df":0,"docs":{},"l":{"df":1,"docs":{"2":{"tf":1.0}}}}}},"l":{"df":0,"docs":{},"e":{"df":0,"docs":{},"n":{"df":0,"docs":{},"g":{"df":0,"docs":{},"t":{"df":0,"docs":{},"h":{"df":1,"docs":{"4":{"tf":1.7320508075688772}}}}}},"v":{"df":0,"docs":{},"e":{"df":0,"docs":{},"l":{"df":2,"docs":{"1":{"tf":1.0},"3":{"tf":1.0}}}}}}},"m":{"a":{"df":0,"docs":{},"p":{"df":2,"docs":{"2":{"tf":1.4142135623730951},"3":{"tf":1.4142135623730951}}}},"df":0,"docs":{},"e":{"df":0,"docs":{},"t":{"a":{"d":{"a":{"df":0,"docs":{},"t":{"a":{"df":1,"docs":{"3":{"tf":1.0}}},"df":0,"docs":{}}},"df":0,"docs":{}},"df":0,"docs":{}},"df":0,"docs":{}}}},"n":{"a":{"df":0,"docs":{},"l":{"df":0,"docs":{},"g":{"df":0,"docs":{},"e":{"b":{"df":0,"docs":{},"r":{"a":{":":{":":{"df":0,"docs":{},"v":{"df":0,"docs":{},"e":{"c":{"df":0,"docs":{},"t":{"df":0,"docs":{},"o":{"df":0,"docs":{},"r":{"2":{"df":1,"docs":{"2":{"tf":1.0}}},"df":0,"docs":{}}}}},"df":0,"docs":{}}}},"df":0,"docs":{}},"df":0,"docs":{}},"df":0,"docs":{}}},"df":0,"docs":{}}}}},"df":1,"docs":{"4":{"tf":1.0}}},"p":{"df":0,"docs":{},"l":{"a":{"df":0,"docs":{},"y":{"df":0,"docs":{},"e":{"df":0,"docs":{},"r":{"df":2,"docs":{"1":{"tf":1.4142135623730951},"2":{"tf":1.0}}}}}},"df":0,"docs":{}},"u":{"b":{"df":2,"docs":{"2":{"tf":1.7320508075688772},"3":{"tf":1.0}}},"df":0,"docs":{}}},"r":{"a":{"b":{"b":{"df":0,"docs":{},"i":{"df":0,"docs":{},"t":{"df":1,"docs":{"1":{"tf":1.0}}}}},"df":0,"docs":{}},"df":0,"docs":{}},"df":0,"docs":{},"l":{"df":0,"docs":{},"e":{"df":1,"docs":{"4":{"tf":1.7320508075688772}}}},"u":{"df":0,"docs":{},"n":{"df":1,"docs":{"4":{"tf":1.7320508075688772}}},"s":{"df":0,"docs":{},"t":{"df":1,"docs":{"0":{"tf":1.0}}}}}},"s":{"df":0,"docs":{},"e":{"df":0,"docs":{},"l":{"df":0,"docs":{},"f":{"df":1,"docs":{"2":{"tf":1.4142135623730951}}}}},"k":{"df":0,"docs":{},"i":{"df":0,"docs":{},"p":{"df":2,"docs":{"2":{"tf":1.7320508075688772},"3":{"tf":1.0}}}}},"p":{"a":{"c":{"df":0,"docs":{},"e":{"df":1,"docs":{"1":{"tf":1.0}}}},"df":0,"docs":{}},"df":0,"docs":{}},"t":{"df":0,"docs":{},"r":{"df":0,"docs":{},"i":{"df":0,"docs":{},"n":{"df":0,"docs":{},"g":{"df":1,"docs":{"3":{"tf":1.0}}}}},"u":{"c":{"df":0,"docs":{},"t":{"df":2,"docs":{"2":{"tf":1.4142135623730951},"3":{"tf":1.0}}}},"df":0,"docs":{}}}}},"t":{"df":0,"docs":{},"h":{"df":0,"docs":{},"i":{"df":0,"docs":{},"n":{"df":0,"docs":{},"k":{"df":1,"docs":{"1":{"tf":1.0}}}}}},"i":{"df":0,"docs":{},"l":{"df":0,"docs":{},"e":{"df":1,"docs":{"2":{"tf":1.0}}}},"t":{"df":0,"docs":{},"l":{"df":1,"docs":{"1":{"tf":1.0}}}}},"o":{"d":{"df":0,"docs":{},"o":{"df":1,"docs":{"8":{"tf":1.0}}}},"df":0,"docs":{}}},"u":{"8":{"df":1,"docs":{"2":{"tf":1.0}}},"df":0,"docs":{},"s":{"df":1,"docs":{"2":{"tf":1.4142135623730951}},"i":{"df":0,"docs":{},"z":{"df":1,"docs":{"2":{"tf":1.0}}}}}},"v":{"df":0,"docs":{},"e":{"c":{"!":{"[":{"df":0,"docs":{},"t":{"df":0,"docs":{},"i":{"df":0,"docs":{},"l":{"df":0,"docs":{},"e":{"df":0,"docs":{},"s":{":":{":":{"df":0,"docs":{},"e":{"df":0,"docs":{},"m":{"df":0,"docs":{},"p":{"df":0,"docs":{},"t":{"df":0,"docs":{},"i":{"df":1,"docs":{"2":{"tf":1.0}}}}}}}},"df":0,"docs":{}},"df":0,"docs":{}}}}}}},"df":0,"docs":{}},"<":{"df":0,"docs":{},"t":{"df":0,"docs":{},"i":{"df":0,"docs":{},"l":{"df":1,"docs":{"2":{"tf":1.0}}}}}},"df":0,"docs":{},"t":{"df":0,"docs":{},"o":{"df":0,"docs":{},"r":{"2":{"<":{"df":0,"docs":{},"i":{"3":{"2":{"df":1,"docs":{"2":{"tf":1.4142135623730951}}},"df":0,"docs":{}},"df":0,"docs":{}}},"df":0,"docs":{}},"df":0,"docs":{}}}}},"df":0,"docs":{}}},"w":{"a":{"df":0,"docs":{},"l":{"df":0,"docs":{},"l":{"df":2,"docs":{"1":{"tf":1.0},"2":{"tf":1.0}}}}},"df":0,"docs":{},"i":{"df":0,"docs":{},"t":{"df":0,"docs":{},"h":{"_":{"d":{"df":0,"docs":{},"i":{"df":0,"docs":{},"m":{"df":0,"docs":{},"e":{"df":0,"docs":{},"n":{"df":0,"docs":{},"s":{"df":0,"docs":{},"i":{"df":0,"docs":{},"o":{"df":0,"docs":{},"n":{"df":0,"docs":{},"s":{"(":{"d":{"df":0,"docs":{},"i":{"df":0,"docs":{},"m":{"df":0,"docs":{},"e":{"df":0,"docs":{},"n":{"df":0,"docs":{},"s":{"df":1,"docs":{"2":{"tf":1.0}}}}}}}},"df":0,"docs":{}},"df":0,"docs":{}}}}}}}}}}},"df":0,"docs":{}},"df":0,"docs":{}}}}},"x":{"df":0,"docs":{},"s":{"b":{"df":1,"docs":{"1":{"tf":1.4142135623730951}}},"df":0,"docs":{},"o":{"df":0,"docs":{},"k":{"df":0,"docs":{},"o":{"b":{"a":{"df":0,"docs":{},"n":{"df":1,"docs":{"1":{"tf":1.0}}}},"df":0,"docs":{}},"df":0,"docs":{}}}}}}}},"title":{"root":{"df":0,"docs":{},"e":{"df":0,"docs":{},"n":{"c":{"df":0,"docs":{},"o":{"d":{"df":1,"docs":{"4":{"tf":1.0}}},"df":0,"docs":{}}},"df":0,"docs":{}}},"l":{"df":0,"docs":{},"e":{"df":0,"docs":{},"n":{"df":0,"docs":{},"g":{"df":0,"docs":{},"t":{"df":0,"docs":{},"h":{"df":1,"docs":{"4":{"tf":1.0}}}}}}}},"r":{"df":0,"docs":{},"u":{"df":0,"docs":{},"n":{"df":1,"docs":{"4":{"tf":1.0}}}}}}}},"lang":"English","pipeline":["trimmer","stopWordFilter","stemmer"],"ref":"id","version":"0.9.5"},"results_options":{"limit_results":30,"teaser_word_count":30},"search_options":{"bool":"OR","expand":true,"fields":{"body":{"boost":1},"breadcrumbs":{"boost":1},"title":{"boost":2}}}});