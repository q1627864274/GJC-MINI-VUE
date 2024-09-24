import { isObject } from "../shared/index";
import { mutableHandlers, readonlyHandlers,shallowReadonlyHandlers } from "./baseHandlers";
export const enum ReactiveFlags {
  IS_REACTIVE = "_isReactive",
  IS_READONLY = "_isReadonly",
}
export function reactive(raw) {
  return createActiveObject(raw, mutableHandlers);
}

export function readonly(raw) {
  return createActiveObject(raw, readonlyHandlers);
}

export function shallowReadonly(raw){
  return createActiveObject(raw, shallowReadonlyHandlers)
}

function createActiveObject(raw, baseHandlers) {
  if (!isObject(raw)){
    console.warn(`target ${raw} 必须是一个对象`)
    return raw
  }
  return new Proxy(raw, baseHandlers);
}

export function isReactive(value) {
  // 通过触发reactive的get操作，获得readonly的值来判断是什么get
  return !!value[ReactiveFlags.IS_REACTIVE];
}
export function isReadonly(value){
  return !!value[ReactiveFlags.IS_READONLY]
}
export function isProxy(value){
  return isReactive(value) || isReadonly(value)
}