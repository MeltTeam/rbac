import type { App } from 'vue'

export function setUpPinia(app: App<Element>) {
  const pinia = createPinia()
  // pinia.use()
  app.use(pinia)
}
export * from './modules'
