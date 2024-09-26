import { ShapeFlags } from "../shared/ShapeFlags";
import { createComponentInstance, setupComponent } from "./component";
import { Fragment, Text } from "./vnode";

export function render(vnode, container) {
  // patch
  patch(vnode, container);
}

function patch(vnode, container) {
  // ShapeFlags
  // vnode -> flag
  // element

  // 判断 是不是 element | 组件

  const { type, shapeFlag } = vnode;
  //  Fragment -> 只渲染children
  switch (type) {
    case Fragment:
      processFragment(vnode, container);
      break;
    case Text:
      processText(vnode, container);
      break;
    default:
      if (shapeFlag & ShapeFlags.ELEMENT) {
        processElemnt(vnode, container);
        // 判断是不是STATEFUL_COMPONENT
      } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
        processComponent(vnode, container);
      }
      break;
  }
}

function processText(vnode: any, container: any) {
  const { children } = vnode;
  const textNode = (vnode.el = document.createTextNode(children));
  container.append(textNode);
}

function processFragment(vnode: any, container: any) {
  // Implement
  mountChildren(vnode, container);
}

function processElemnt(vnode: any, container: any) {
  mountElement(vnode, container);
}

// 处理element
function mountElement(vnode: any, container: any) {
  // vnode -> element -> div
  const el = (vnode.el = document.createElement(vnode.type));

  // string array
  const { children, shapeFlag } = vnode;
  //typeof children === "string"
  if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
    // text_children
    el.textContent = children;
  } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
    // array_children
    // vnode
    mountChildren(vnode, el);
  }

  // props
  const { props } = vnode;
  for (const key in props) {
    // console.log(key);
    const val = props[key];
    // 具体的click -> 通用
    // on + Event name
    const isOn = (key: string) => /^on[A-Z]/.test(key);
    if (isOn(key)) {
      const event = key.slice(2).toLowerCase();
      el.addEventListener(event, val);
    }
    el.setAttribute(key, val);
  }
  container.append(el);
}
function mountChildren(vnode, container) {
  vnode.children.forEach((v) => {
    patch(v, container);
  });
}

function processComponent(vnode, container) {
  mountComponent(vnode, container);
}

function mountComponent(initialVnode, container) {
  const instance = createComponentInstance(initialVnode);
  setupComponent(instance);
  setupRenderEffect(instance, initialVnode, container);
}
function setupRenderEffect(instance, initialVnode, container) {
  const { proxy } = instance;
  // 执行模板中含有的render函数
  const subTree = instance.render.call(proxy);
  // vnode -> patch
  // vnode -> element -> mountElement
  patch(subTree, container);

  // 在这个时机vnode.el才有值
  // element -> mount
  initialVnode.el = subTree.el;
}
