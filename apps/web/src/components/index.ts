import MButton from './MButton/index.vue'
import MForm from './MForm/index.vue'
import MI18nBtn from './MI18nBtn/index.vue'
import MLoading from './MLoading/index.vue'
import MModeBtn from './MModeBtn/index.vue'
import MThemeBtn from './MThemeBtn/index.vue'
import MVideo from './MVideo/index.vue'
// 异步
/** 异步动态表单 */
const AsyncMForm = defineAsyncComponent({
  loader: () => import('./MForm/index.vue'),
})
/** 异步主题按钮 */
const AsyncMThemeBtn = defineAsyncComponent({
  loader: () => import('./MThemeBtn/index.vue'),
})
// 导出
export * from './MForm/IMForm'
export * from './MLoading/IMLoading'
export {
  AsyncMForm,
  AsyncMThemeBtn,
  MButton,
  /** 动态表单 */
  MForm,
  /** i18n按钮 */
  MI18nBtn,
  /** 加载中间页组件 */
  MLoading,
  MModeBtn,
  /** 主题按钮 */
  MThemeBtn,
  MVideo,
}
