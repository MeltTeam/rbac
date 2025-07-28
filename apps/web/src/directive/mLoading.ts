import type { DirectiveBinding } from 'vue'
import { MLoading } from '@/components'
import { getComponentDom } from '@/utils/component.util'

export function mLoading(_el: Element, binding: DirectiveBinding) {
  const isDom = window.document.querySelector('.MLoading_container')
  if (!binding.value) {
    if (isDom) {
      isDom.remove()
      console.warn('mLoading remove')
    }
    return
  }
  const appDom = window.document.querySelector('.App_container')
  if (!isDom && appDom) {
    const loadingDom = getComponentDom(MLoading)
    console.warn('mLoading append')
    appDom.appendChild(loadingDom)
  }
}
