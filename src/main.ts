import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { clerkPlugin } from '@clerk/vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'

import App from './App.vue'
import router from './router'
import { config } from './config'

const app = createApp(App)

// 設定 Pinia 狀態管理
app.use(createPinia())

// 設定 Clerk 認證
app.use(clerkPlugin, {
  publishableKey: config.clerk.publishableKey,
  afterSignInUrl: '/dashboard',
  afterSignUpUrl: '/dashboard',
  signInUrl: '/sign-in',
  signUpUrl: '/sign-up'
})

// 設定 Element Plus UI
app.use(ElementPlus)

// 設定路由
app.use(router)

app.mount('#app') 