import { h, renderSlots } from "../../lib/guide-mini-vue.esm.js";

export const Foo = {
  name: "foo",
  setup() {
    return {};
  },
  render() {
    const foo = h("p", {}, "foo");
    // 插槽本质 -> 获取Foo.vnode.children 添加到下面children数组里面去
    console.log(this.$slots);
    // children -> vnode
    //
    // renderSlots
    // 1. 获取到要渲染的元素
    // 2. 获取到要渲染的位置
    // 3  作用域插槽  将foo组件的变量用在插槽上面
    const age = 19;
    return h("div", {}, [
      renderSlots(this.$slots, "header", { age }),
      foo,
      renderSlots(this.$slots, "footer"),
    ]);
  },
};
