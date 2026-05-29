export { default as MCard } from './index.vue'
export const AsyncMCard = defineAsyncComponent({
  loader: () => import('./index.vue'),
})
