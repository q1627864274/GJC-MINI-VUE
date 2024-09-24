import { render } from "./render";
import { createVNode } from "./vnode";

export function createApp(rootComponent) {
    return {
      mount(rootContainer) {
        // 先 vnode 
        // component → vnode
        // 所有的逻辑操作都会基于 vnode 做处理
        const vnode = createVNode(rootComponent);
        render(vnode, rootContainer)
      }
    };
  }