export * from './IMForm'
export { default as MForm } from './index.vue'
export * from './useMForm'
export const AsyncMForm = defineAsyncComponent({
  loader: () => import('./index.vue'),
})
