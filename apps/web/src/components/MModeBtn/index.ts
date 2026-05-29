export { default as MModeBtn } from './index.vue'
export const AsyncMModeBtn = defineAsyncComponent({
  loader: () => import('./index.vue'),
})
