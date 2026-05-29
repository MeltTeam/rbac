export * from './IMThemeBtn'
export { default as MThemeBtn } from './index.vue'
export const AsyncMThemeBtn = defineAsyncComponent({
  loader: () => import('./index.vue'),
})
