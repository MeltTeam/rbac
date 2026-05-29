import { createApp } from 'vue'
import App from '@/App.vue'
import { setupRouter } from '@/routers'
import { setupI18n } from './i18n'
import { setupPinia } from './stores'
import { pluginsInstall } from './utils/plugins.util'
import '@unocss/reset/tailwind-compat.css'
import '@/assets/css/design-tokens.css'
import '@/assets/css/uno-vars.css'
import '@/assets/css/base.css'
import '@/assets/css/nprogress.css'

const app = createApp(App)
setupPinia(app)
setupI18n(app)
setupRouter(app)
app.use(pluginsInstall)
app.mount('#app')
