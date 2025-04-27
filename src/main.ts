import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from '@/plugins/axios'

const app = createApp(App)

// axios를 전역적으로 사용할 수 있도록 설정
app.config.globalProperties.$axios = axios

app.use(router)
app.use(store)

app.mount('#app') 