import type { FormInstance, FormProps } from 'element-plus'
import type { RendererElement, RendererNode } from 'vue'
import type { CompMap, ICompAttrsMap, ICompEventsMap, ICompPropsMap, ICompSlotsMap } from './compMap'

/** 组件类型 */
export type THFn = () => globalThis.VNode<
  RendererNode,
  RendererElement,
  {
    [key: string]: any
  }
>
export type TCompMapKey = keyof typeof CompMap
export interface IFormItems<T extends TCompMapKey = TCompMapKey> {
  /** 组件类型,h函数,不传(插槽传模板) */
  type: TCompMapKey | THFn
  /** 绑定key */
  key: string
  label?: string
  attrs?: T extends keyof ICompAttrsMap ? ICompAttrsMap[T] : Record<string, never>
  props?: T extends keyof ICompPropsMap ? ICompPropsMap[T] : Record<string, never>
  events?: T extends keyof ICompEventsMap ? ICompEventsMap[T] : Record<string, never>
  slots?: T extends keyof ICompSlotsMap ? ICompSlotsMap[T] | string | number : Record<string, never>
  span?: number
  /** 是否隐藏 */
  hidden?: boolean
}
export type MFormProps = {
  /** 表单标题 */
  formTitle?: string
  /** 表单项间隙 */
  gutter?: number
  /** 表单项 */
  formItems: Array<IFormItems>
  /** 表单数据绑定 */
  model: FormProps['model']
} & FormProps
export interface MFormInstance extends FormInstance {
  $props: MFormProps
}
