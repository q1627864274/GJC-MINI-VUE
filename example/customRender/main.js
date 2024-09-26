import { createRender } from "../../lib/guide-mini-vue.esm.js";
import { App } from "./App.js";
console.log(PIXI);
const app = new PIXI.Application();
await app.init({ width: 640, height: 360 });
document.body.appendChild(app.canvas);
// const game = new PIXI.Application.init({ width: 500, height: 500 });
// document.body.append(game.view);
const renderer = createRender(
  (type) => {
    if (type === "rect") {
      const rect = new PIXI.Graphics();
      rect.beginFill(0xff0000);
      rect.drawRect(0, 0, 100, 100);
      rect.endFill();
      return rect;
    }
  },
  (el, key, val) => {
    el[key] = val;
  },
  (el, parent) => {
    parent.addChild(el);
  }
);
renderer.createApp(App).mount(app.stage);