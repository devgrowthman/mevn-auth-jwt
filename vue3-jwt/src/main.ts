import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import { initializeAuth } from '@/composables/useAuthInitialization'
import { registerGlobalComponents } from './plugins/components.ts'
import { VueQueryPlugin } from '@tanstack/vue-query'
import { queryClient } from './plugins/vue-query.ts'

const app = createApp(App)

app.use(createPinia())

await initializeAuth()
app.use(router)

app.use(VueQueryPlugin, { queryClient })
registerGlobalComponents(app)

app.mount('#app')
