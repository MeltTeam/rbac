export { default as MI18nBtn } from './index.vue'
export const AsyncMI18nBtn = defineAsyncComponent({
  loader: () => import('./index.vue'),
})
