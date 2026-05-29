export * from './IMButton'
export { default as MButton } from './index.vue'
export const AsyncMButton = defineAsyncComponent({
  loader: () => import('./index.vue'),
})
