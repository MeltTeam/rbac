export * from './IMAside'
export { default as MAside } from './index.vue'
export const AsyncMAside = defineAsyncComponent({
  loader: () => import('./index.vue'),
})
