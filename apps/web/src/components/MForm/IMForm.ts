import type { ButtonProps, FormProps, InputProps } from 'element-plus'
import type { RendererElement, RendererNode } from 'vue'

/** 组件类型 */
export type componentType = 'Input' | 'Button' | 'Template'
export type TComponentMap = Record<componentType, any>
export type THFn = () => globalThis.VNode<
  RendererNode,
  RendererElement,
  {
    [key: string]: any
  }
>
export interface IFormItems {
  /** 组件类型或h函数 */
  type: componentType | THFn
  /** 绑定key */
  key: string
  label?: string
  attrs?: any
  props?: Partial<InputProps> | Partial<ButtonProps>
  slots?: Record<string, THFn> | string | number
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
} & Partial<FormProps>
