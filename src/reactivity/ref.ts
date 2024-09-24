import { hasChanged, isObject } from "../shared";
import { isTracking, trackEffects, triggerEffects } from "./effect";
import { reactive } from "./reactive";
// 1 true "1"
// get set
// proxy -> object
// {} -> value get set
class RefImpl {
  private _value: any;
  public dep;
  private _rawValue: any;
  public _v_isRef = true;
  constructor(value) {
    // 传进来对象，保持原始类型，方便set对象比对
    this._rawValue = value;
    this._value = convert(value);
    // value -> reactive
    this.dep = new Set();
  }
  // get value()是一个获取器（getter）方法
  // 调用这个获取器方法来获取实例内部私有变量_value的值
  get value() {
    trackRefValue(this);
    return this._value;
  } ///
  set value(newValue) {
    // newValve -> this.value
    if (hasChanged(newValue, this._rawValue)) {
      this._rawValue = newValue;
      // 一定是先修改了value的
      this._value = convert(newValue);
      triggerEffects(this.dep);
    }
  }
}
function convert(value) {
  return isObject(value) ? reactive(value) : value;
}
export function ref(value) {
  return new RefImpl(value);
}

function trackRefValue(ref) {
  if (isTracking()) {
    trackEffects(ref.dep);
  }
}

export function isRef(ref) {
  return !!ref._v_isRef;
}
export function unRef(ref) {
  // 看看是不是一个ref -> ref.value
  // ref
  return isRef(ref) ? ref.value : ref;
}

export function proxyRefs(objectWithRefs) {
  // get -> age(ref) 那么就给他返回.value
  // not ref 返回本身value
  return new Proxy(objectWithRefs, {
    get(target, key) {
      return unRef(Reflect.get(target, key))
    },

    // set -> ref  -> .value
    set(target, key, value){
      // ref -> .value覆盖
      if (isRef(target[key]) && !isRef(value)) {
        return target[key].value = value
        // not ref  -> 直接覆盖
      }else {
        return Reflect.set(target, key, value)
      }
    }
  });



}
