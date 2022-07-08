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