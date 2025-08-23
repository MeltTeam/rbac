import { createApp } from 'vue'
import App from '@/App.vue'
import router from '@/router'
import { setUpI18n } from './i18n'
import { pluginsInstall } from './plugins'
import { setUpPinia } from './store'
// 格式化
import '@unocss/reset/tailwind-compat.css'
import '@/assets/css/base.css'
import '@/assets/css/uno-vars.css'
import '@/assets/css/dark/css-vars.css'
import '@/assets/css/nprogress.css'

const app = createApp(App)

setUpPinia(app)
setUpI18n(app)
app.use(router)
app.use(pluginsInstall)
app.mount('#app')
