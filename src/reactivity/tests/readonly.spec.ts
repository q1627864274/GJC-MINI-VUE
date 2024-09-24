import { isProxy, isReadonly, readonly } from "../reactive";

describe("readonly", () => {
  it("should make nested values readonly", () => {
    const original = { foo: 1, bar: { baz: 2 } };
    const wrapped = readonly(original);
    expect(wrapped).not.toBe(original);
    expect(isReadonly(wrapped)).toBe(true);
    expect(isReadonly(original)).toBe(false);
    // 嵌套判断
    expect(isReadonly(wrapped.bar)).toBe(true);
    
    expect(isProxy(wrapped)).toBe(true)
    expect(wrapped.foo).toBe(1);
  });
  it("warn then call set", () => {
    // mock console.warn
    console.warn = jest.fn();
    const user = readonly({ age: 10 });
    user.age = 11;
    expect(console.warn).toBeCalled();
  });
});
