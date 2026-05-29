export { default as MVideo } from './index.vue'
export const AsyncMVideo = defineAsyncComponent({
  loader: () => import('./index.vue'),
})
