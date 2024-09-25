import { ShapeFlags } from "../shared/ShapeFlags";

// 将组件children挂载到组件slots上面
export function initSlots(instance, children) {
  // 判断到底是不是一个slots
  const {vnode } = instance
  if (vnode.shapeFlag & ShapeFlags.SLOT_CHILDREN){
    normalizeObjectSlots(children, instance.slots);
  }
}

function normalizeObjectSlots(children: any, slots: any) {
  for (const key in children) {
    const value = children[key];
    slots[key] = (props) =>  normalizeSlotValue(value(props));
  }
}

function normalizeSlotValue(value) {
  return Array.isArray(value)? value : [value];
}