import type { ButtonProps, FormProps, InputProps } from 'element-plus'
import type { RendererElement, RendererNode } from 'vue'

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
  type: componentType | THFn
  key: string
  label?: string
  attrs?: any
  props?: Partial<InputProps> | Partial<ButtonProps>
  slots?: Record<string, THFn> | string | number
  span?: number
  hidden?: boolean
}
export type LoginFormProps = {
  /** 表单标题 */
  formTitle?: string
  /** 表单项间隙 */
  gutter?: number
  /** 表单项 */
  formItems: Array<IFormItems>
  /** 表单数据绑定 */
  model: FormProps['model']
} & Partial<FormProps>
