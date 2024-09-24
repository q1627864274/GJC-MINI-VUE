import { extend } from "../shared";
let activeEffect;
let shouldTrack;

export class ReactiveEffect {
  private _fn: any;
  deps = [];
  //  是否stop，为true就是stop状态，清除依赖
  active = true;
  onStop?: () => void;
  public scheduler: Function | undefined
  constructor(fn, scheduler?:Function) {
    this._fn = fn;
    this.scheduler = scheduler
  }
  run() {
    // 表示是stop后的状态
    if (!this.active) {
      return this._fn();
    }
    // 不是stop状态下
    shouldTrack = true;
    //  表示收集依赖
    activeEffect = this;
    const result = this._fn();
    // reset
    shouldTrack = false;
    return result;
  }
  stop() {
    // 找到deps进行清空对应的activeEffect
    // 使用active进行性能优化，避免频繁stop频繁调用
    if (this.active) {
      cleanupEffect(this);
      if (this.onStop) {
        this.onStop();
      }
      this.active = false;
    }
  }
}
function cleanupEffect(effect) {
  effect.deps.forEach((dep: any) => {
    dep.delete(effect);
  });
  effect.deps.length = 0;
}
// Map {
//   { name: 'Object1' } => Map {
//     'name' => Set {}
//   },
//   { age: 25 } => Map {
//     'age' => Set {}
//   }
// }
const targetMap = new Map();
export function track(target, key) {
  if (!isTracking()) return
  // target -> key -> dep
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    depsMap = new Map();
    targetMap.set(target, depsMap);
  }
  let dep = depsMap.get(key);
  if (!dep) {
    dep = new Set();
    depsMap.set(key, dep);
  }
  trackEffects(dep)

}
export function trackEffects(dep) {
  // 不要重复添加deep
  if(dep.has(activeEffect)) return
  // 使用全局变量activeEffect将_effect加入dep里面
  dep.add(activeEffect);
  // 存储所有的dep，方便stop的时候删除所有的
  activeEffect.deps.push(dep);
}
export function isTracking() {
  //activeEffect 是否存在依赖，
  // 是否应该收集依赖针对，stop，a++的情况
  return shouldTrack && activeEffect !== undefined;
}
export function effect(fn: any, options: any = {}) {
  const _effect: any = new ReactiveEffect(fn, options.scheduler);
  // options
  // extend 这样方便些option有很多属性
  extend(_effect, options);
  _effect.run();
  const runner: any = _effect.run.bind(_effect);
  runner.effect = _effect;
  return runner;
}
export function trigger(target, key) {
  let depsMap = targetMap.get(target);
  let dep = depsMap.get(key);
  triggerEffects(dep)
}

export function triggerEffects(dep){
  for (const effect of dep) {
    if (effect.scheduler){
      effect.scheduler()
    }else {
      effect.run();
    }
  }
}

export function stop(runner) {
  // 指向类中的stop实例方法
  runner.effect.stop();
}
