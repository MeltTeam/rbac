import type { Directive } from 'vue'
import { MLoading } from '@/components'
import { getComponentDom } from '@/utils/component.util'

export interface MLoadingBinding {
  isLoading: boolean
}
/** 处理 loading 显示/隐藏的逻辑 */
function handleLoading(value: boolean, el: HTMLElement) {
  const isDom = window.document.querySelector('.MLoading_container')
  if (!value) {
    if (isDom) {
      isDom.remove()
      console.warn('mLoading remove')
    }
    return
  }
  if (!isDom && el) {
    const loadingDom = getComponentDom(MLoading)
    console.warn('mLoading append')
    el.appendChild(loadingDom)
  }
}

/** mLoading 指令 */
export const mLoading: Directive = {
  mounted(el, binding) {
    handleLoading(binding.value, el)
  },
  updated(el, binding) {
    handleLoading(binding.value, el)
  },
  unmounted(el) {
    handleLoading(false, el)
  },
}
