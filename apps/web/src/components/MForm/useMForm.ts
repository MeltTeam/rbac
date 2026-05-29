import type { FormInstance, FormRules } from 'element-plus'
import type { UnwrapNestedRefs } from 'vue'
import type { IFormItems } from '@/components'
import { useI18n } from 'vue-i18n'

export interface IUseFormOptions<T extends object = object> {
  /** 表单数据 */
  formData: T
  /** 表单项 */
  formItems: IFormItems[]
  /** 表单项是否依赖i18n */
  formItemsI18n?: boolean
  /** 表单规则 */
  formRules: FormRules<T>
  /** 表单规则是否依赖i18n */
  formRulesI18n?: boolean
}
export function useMForm<T extends object = object>(options: IUseFormOptions<T>) {
  const { formData, formItems, formRules, formItemsI18n = false, formRulesI18n = false } = options
  const { locale } = useI18n()
  const formDataProxy = isReactive(formData) ? (formData as UnwrapNestedRefs<T>) : reactive<T>(formData)

  // 表单实例
  const formInstance = ref<FormInstance | null>(null)
  function setFormInstance(_formInstance: FormInstance | null) {
    formInstance.value = _formInstance ?? null
  }
  // 表单项
  const formItemsProxy = computed<IFormItems[]>(() => {
    // 可能会依赖i18n，所以这里要收集一下依赖，重新计算
    const _ = formItemsI18n && locale.value
    return formItems
  })
  // 表单规则
  const formRulesProxy = computed<FormRules<T>>(() => {
    // 可能会依赖i18n，所以这里要收集一下依赖，重新计算
    const _ = formRulesI18n && locale.value
    return formRules
  })

  const isValid = computed(() => {
    const fields = formInstance.value?.fields
    if (!fields?.length) return false
    return fields.every((field: any) => field.validateState === 'success')
  })

  const isSubmitDisabled = computed(() => !isValid.value)

  return {
    /** 表单数据代理 */
    formDataProxy,
    /** 表单实例代理 */
    formInstance,
    /** 表单实例获取  */
    setFormInstance,
    /** 表单项代理 */
    formItemsProxy,
    /** 表单规则代理 */
    formRulesProxy,
    /** 表单验证 */
    isValid,
    /** 提交禁用(是否表单验证全部通过) */
    isSubmitDisabled,
  }
}
