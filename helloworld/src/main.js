import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import './style.css'
import App from './App.vue'

//Importar vistas
import HomeView from '././views/HomeView.vue'
//import MonedaView from './views/MonedaView.vue'
import './assets/main.css'




//configurar las rutas
/*const routes = createRouter({
    history: createWebHistory(),
    routes:[
       {path: '/', component: MonedaView},
       //Se agregan las demas rutas aqui 
    ]
})*/

//configurar las rutas
const routes = createRouter({
    history: createWebHistory(),
    routes:[
       {path: '/', component: HomeView},
       //Se agregan las demas rutas aqui 
    ]
})

//createApp(App).mount('#app')
const app = createApp(App)
app.use (createPinia())
app.use(routes)
app.mount('#app')