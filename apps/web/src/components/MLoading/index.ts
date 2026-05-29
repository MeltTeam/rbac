export * from './IMLoading'
export { default as MLoading } from './index.vue'
export const AsyncMLoading = defineAsyncComponent({
  loader: () => import('./index.vue'),
})
