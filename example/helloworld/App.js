import { h } from "../../lib/guide-mini-vue.esm.js";
import { Foo } from "./Foo.js";
window.self = null;
export const App = {
  name: "App",
  // 必须要写render
  render() {
    window.self = this;
    // 为了方便使用this.msg，this.$el -> get root element
    // 多个对象都要用到render中的this进行获取 -> proxy
    return h(
      "div",
      {
        id: "root",
        class: ["red", "hard"],
        onClick: () => {
          console.log("click");
        },
        onMousedown: () => {
          console.log("onMousedown");
        },
      },
      [h("div", {}, "hi, " + this.msg), h(Foo, {count: 1})]

      // [h("p", { class: "red" }, "hi"), h("p", { class: "blue" }, "mini-vu")]
    );
  },
  setup() {
    return {
      msg: "mini-vue-123",
    };
  },
};
