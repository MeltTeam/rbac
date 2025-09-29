import type { ValidationArguments, ValidationOptions } from 'class-validator'
import { applyDecorators } from '@nestjs/common'
import { IsArray, IsEmail, IsJWT, IsNotEmpty, Length, Matches, registerDecorator } from 'class-validator'
/**
 * 验证输入字符串长度
 * @param min 最小长度
 * @param max 最大长度
 * @param name key名
 * @param isArray 是否是数组
 */
export function InputStringLength(min: number, max: number, name: string, isArray: boolean = false) {
  return applyDecorators.apply(this, [
    Length(min, max, {
      message: `${name}${min === max ? `长度为${min}位` : `在 ${min} ~ ${max} 位之间`}`,
      each: isArray,
    }),
  ])
}

/**
 * 不能为空
 * @param name key名
 * @param isArray 是否是数组
 */
export function NotEmpty(name: string, isArray: boolean = false) {
  return applyDecorators.apply(this, [
    IsNotEmpty({
      message: `${name}不能为空`,
      each: isArray,
    }),
  ])
}

/**
 * 验证邮箱
 * @param isArray 是否是数组
 */
export function InputEmail(isArray: boolean = false) {
  return applyDecorators.apply(this, [
    IsEmail(
      {},
      {
        message: '邮箱格式不合法',
        each: isArray,
      },
    ),
  ])
}

/**
 * 验证密码
 * @param isArray 是否是数组
 */
export function InputPwd(isArray: boolean = false) {
  return applyDecorators.apply(this, [
    Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, {
      message: '密码需含大小写字母、数字，且至少8位',
      each: isArray,
    }),
  ])
}

/**
 * 验证空格
 * @param name key名
 * @param isArray 是否是数组
 */
export function InputSpace(name: string, isArray: boolean = false) {
  return applyDecorators.apply(this, [
    Matches(/^\S*$/, {
      message: `${name}不能包含空格`,
      each: isArray,
    }),
  ])
}

/**
 * 验证数组
 * @param name key名
 * @param isArray 是否是数组
 */
export function InputArray(name: string, isArray: boolean = false) {
  return applyDecorators.apply(this, [
    IsArray({
      message: `${name}列表必须是数组`,
      each: isArray,
    }),
  ])
}

/**
 * 验证JWT
 * @param name key名
 * @param isArray 是否是数组
 */
export function InputJWT(name: string, isArray: boolean = false) {
  return applyDecorators.apply(this, [
    IsJWT({
      message: `${name}是不合法的JWT格式`,
      each: isArray,
    }),
  ])
}

/**
 * 对比验证
 * @param compareArray 对比的键名,当前属性值与数组中所有属性值一致才验证通过
 * @param options 参数
 */
export function InputCompare(compareArray: Array<string>, options?: ValidationOptions) {
  return function (obj: any, propertyName: string) {
    registerDecorator({
      target: obj.constructor,
      propertyName,
      options,
      validator: {
        validate(_value: any, args: ValidationArguments) {
          if (compareArray.length === 0) throw new Error(`compareArray不能为空数组`)
          const _obj = args.object
          const currentValue = _obj[propertyName]
          return compareArray.every((key) => Object.is(currentValue, _obj[key]))
        },
        defaultMessage(..._args: any[]) {
          return `${compareArray.length > 1 ? compareArray.join(',') : compareArray[0]},${propertyName}不一致`
        },
      },
    })
  }
}
