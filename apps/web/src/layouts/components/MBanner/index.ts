export { default as MBanner } from './index.vue'
export const AsyncMBanner = defineAsyncComponent({
  loader: () => import('./index.vue'),
})
