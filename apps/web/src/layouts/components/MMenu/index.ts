export * from './IMMenu'
export { default as MMenu } from './index.vue'
export const AsyncMMenu = defineAsyncComponent({
  loader: () => import('./index.vue'),
})
