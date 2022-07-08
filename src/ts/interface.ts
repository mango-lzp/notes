type ExcludeType<T, K> = T extends K ? never : T

type PickType<T, K extends keyof T> = {
  [P in K]: T[P]
}

type _OmitType<T, K extends keyof T> = PickType<T, ExcludeType<keyof T, K>>
type OmitType<T, K extends keyof T> = {
  [P in ExcludeType<keyof T, K>]: T[P]
}

type obj = {
  a: string
  b: string
  c: string
  d: string
}

type pick = PickType<obj, 'a' | 'b'>
type omit = OmitType<obj, 'a' | 'b'>
type _omit = _OmitType<obj, 'a' | 'b'>


let a = {a: 123}
let b = {a: 123, b: 456}
a = b
// b = a error
// TS 静态解析允许 属性多的赋值给属性少的，称之为类型兼容

let fn1: (a: string) => string
let fn2: (a: string, b: string) => any
fn2 = fn1
// fn1 = fn2 error
//  函数之间的相互赋值，他们的参数类型兼容性是 参数少的赋值给参数多的，称之为 逆变。
//  函数类型赋值兼容时，函数的返回值符合 属性多的给属性少的， 称之为 协变。

type ParamType<T extends (...args: any[]) => any> = T extends (...args: infer K) => any ? K : never
type param = ParamType<typeof fn1>

type _ReturnType<T extends (...args: any[]) => any> = T extends (...args: any[]) => infer K ? K : never
type returnType = _ReturnType<typeof fn1>

// ThisParameterType 的实现
function fn3 (this:{ name: 'fn3' }, a: string) {}
type ThisParamType<T extends (this: any, ...args: any[]) => any> = T extends (this: infer thisType, ...args: any[]) => any ? thisType : never
type thisType = ThisParamType<typeof fn3>

// 元组 转 联合类型
type ArrayToUnion<T extends Array<any>> = T extends Array<infer K> ? K : never
type union = ArrayToUnion<['a', {}]>