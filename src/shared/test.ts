// const ShapeFlags = {
//   element: 0,
//   stateful_component: 0,
//   text_children: 0,
//   array_children: 0,
// };

// vnode -> stateful_component ->
// 可以设置修改
//   ShapeFlags.stateful_component = 1;
//   ShapeFlags.array_children = 1;

// 查找
// if (ShapeFlags.element) {
  //...
// }
// if (ShapeFlags.stateful_component) {
  //...
// }

// 不够高效，考虑使用位运算的方式来替代
// 0000 0001 → element
// 0010 → stateful
// 0100 → text_children
// 1000 → array_children

// 1010

// 修改 |
// 0000 
// 0001
// 0001

// 查找 &
// 0001
// 0001

// 0001

// 0010
// 0001
// 0000