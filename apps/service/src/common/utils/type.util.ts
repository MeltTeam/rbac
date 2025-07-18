/** 类型类名 */
export type TypeClassName =
  | 'String'
  | 'Object'
  | 'Array'
  | 'Number'
  | 'Boolean'
  | 'Null'
  | 'Undefined'
  | 'Function'
  | 'Symbol'
  | 'Date'
  | 'RegExp'
  | 'Error'
  | 'Map'
  | 'Set'
  | 'WeakMap'
  | 'WeakSet'
/**
 * 判断类型
 * @param currentValue 当前值
 * @param typeClassName 类型类名
 * @returns
 */
export function isType(currentValue: any, typeClassName: TypeClassName) {
  return Object.is(Object.prototype.toString.call(currentValue), `[object ${typeClassName}]`)
}
