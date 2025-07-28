import { createApp } from 'vue'
import App from '@/App.vue'
import router from '@/router'
import { setUpI18n } from './i18n'
import { pluginsInstall } from './plugins'
import { setUpPinia } from './store'
import '@unocss/reset/tailwind-compat.css'
import '@/assets/css/base.css'
import 'element-plus/theme-chalk/dark/css-vars.css'

const app = createApp(App)

setUpPinia(app)
setUpI18n(app)
app.use(router)
app.use(pluginsInstall)
app.mount('#app')
