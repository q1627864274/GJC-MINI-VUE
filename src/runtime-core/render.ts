import { effect } from "../reactivity/effect";
import { ShapeFlags } from "../shared/ShapeFlags";
import { createComponentInstance, setupComponent } from "./component";
import { createAppAPI } from "./createApp";
import { Fragment, Text } from "./vnode";

export function createRender(option) {
  const { createElement, patchProp, insert } = option;

  function render(vnode, container) {
    // patch
    patch(null, vnode, container, null);
  }

  // n1 -> 老的
  // n2 -> 新的
  function patch(n1, n2, container, parentComponent) {
    // ShapeFlags
    // vnode -> flag
    // element

    // 判断 是不是 element | 组件

    const { type, shapeFlag } = n2;
    //  Fragment -> 只渲染children
    switch (type) {
      case Fragment:
        processFragment(n1, n2, container, parentComponent);
        break;
      case Text:
        processText(n1, n2, container);
        break;
      default:
        if (shapeFlag & ShapeFlags.ELEMENT) {
          processElemnt(n1, n2, container, parentComponent);
          // 判断是不是STATEFUL_COMPONENT
        } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
          processComponent(n1, n2, container, parentComponent);
        }
        break;
    }
  }

  function processText(n1, n2: any, container: any) {
    const { children } = n2;
    const textNode = (n2.el = document.createTextNode(children));
    container.append(textNode);
  }

  function processFragment(n1, n2: any, container: any, parentComponent) {
    // Implement
    mountChildren(n2, container, parentComponent);
  }

  function processElemnt(n1, n2: any, container: any, parentComponent) {
    if (!n1) {
      mountElement(n2, container, parentComponent);
    } else {
      patchElement(n1, n2, container);
    }
  }
  function patchElement(n1, n2, container) {
    console.log("patchElement");
    console.log("n1", n1);
    console.log("n2", n2);

    //props
    // children
  }

  // 处理element
  function mountElement(vnode: any, container: any, parentComponent) {
    // vnode -> element -> div

    // 不同平台渲染不同的 -> createElement
    // const el = (vnode.el = document.createElement(vnode.type));
    const el = (vnode.el = createElement(vnode.type));

    // children
    // string array
    const { children, shapeFlag } = vnode;
    //typeof children === "string"
    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      // text_children
      el.textContent = children;
    } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      // array_children
      // vnode
      mountChildren(vnode, el, parentComponent);
    }

    // props
    const { props } = vnode;
    for (const key in props) {
      // console.log(key);
      const val = props[key];
      // 具体的click -> 通用
      // on + Event name
      // const isOn = (key: string) => /^on[A-Z]/.test(key);
      // if (isOn(key)) {
      //   const event = key.slice(2).toLowerCase();
      //   el.addEventListener(event, val);
      // }
      // el.setAttribute(key, val);
      patchProp(el, key, val);
    }
    // container.append(el);
    insert(el, container);
  }
  function mountChildren(vnode, container, parentComponent) {
    vnode.children.forEach((v) => {
      patch(null, v, container, parentComponent);
    });
  }

  function processComponent(n1, n2, container, parentComponent) {
    mountComponent(n2, container, parentComponent);
  }

  function mountComponent(initialVnode, container, parentComponent) {
    const instance = createComponentInstance(initialVnode, parentComponent);
    setupComponent(instance);
    setupRenderEffect(instance, initialVnode, container);
  }
  function setupRenderEffect(instance, initialVnode, container) {
    effect(() => {
      if (!instance.isMounted) {
        console.log("init");
        const { proxy } = instance;
        // 执行模板中含有的render函数
        const subTree = (instance.subTree = instance.render.call(proxy));
        console.log(subTree);
        // vnode -> patch
        // vnode -> element -> mountElement
        patch(null, subTree, container, instance);

        // 在这个时机vnode.el才有值
        // element -> mount
        initialVnode.el = subTree.el;

        instance.isMounted = true;
      } else {
        console.log("update");
        const { proxy } = instance;
        const subTree = instance.render.call(proxy);
        const prevSubTree = instance.subTree;
        instance.subTree = subTree;
        patch(prevSubTree, subTree, container, instance);
      }
    });
  }
  return {
    createApp: createAppAPI(render),
  };
}
