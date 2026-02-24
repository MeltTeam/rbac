import { createSSRApp } from 'vue'
import App from './App.vue'
import { routerPlugin } from './router'

export function createApp() {
  const app = createSSRApp(App)
  app.use(routerPlugin)
  return {
    app,
  }
}
