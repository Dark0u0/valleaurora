<template>
  <div class="card">
    <header>
      <div>
        <h2>{{store.ciudad}}</h2>
        <span class ="actualizacion"> {{store.tiempoActualizado}}</span>
      </div>
      <span class="badge">{{store.descripcionClima}}</span>
    </header>
    <div class="estado" v-if="store.cargando">
      <span class="spinner">⏳</span>Actualizando...
    </div>
    <div v-else-if="store.error" class="cargando error">
      ⚠️{{store.error}}
    </div>
    <div v-else  class="datos">
      <p class="icono">{{store.iconoClima}}</p>
      <p class="temp">{{store.clima.temperatura}}°C</p>
      <p class="viento">🌪️{{store.clima.viento}} Km/h</p>
    </div>
    <!--Historial de ciudades-->
    <div v-if='store.historial.length > 0' class="historial">
      <p class="lista-historial">Recientes:</p>
      <span class="hCiudad" v-for='ciudad in store.historial'
      :key='ciudad'>
        {{ciudad}}
      </span>
    </div>
    <button @click="cargarClima" :disabled="store.cargando">
      {{ store.cargando? "Actualizando ...":"Actualizar ..." }}
    </button>
  </div>
</template>
<style scoped>
.card{ border: 2px solid #2563EB; border-radius: 16px;
padding: 28px; max-width: 320px; font-family: Arial, Helvetica, sans-serif;}
header{ display: flex; justify-content: space-between; align-items: center;
}
.badge{
  background: #1E3A5F; padding: 5px 10px;
}
.temp{
  font-size: 48px; font-weight: 800; color: #2563EB; margin: 16px 0;
}
.viento{ colo: #374151; margin: 4px 0;}
.estado {
  padding: 20px 0; columns: #374151;
}
.error{color: #991b1b}
button{
  margin-top: 16px; background: #2563EB; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer;
}
button:disabled{
  opacity: 0.5; cursor: not-allowed;
}
.icono {
  font-size: 48px; margin: 16px 0 0; 
}
.historial{ margin-top: 12px; border-top: 1px solid #e5e7eb; padding-top: 12px;}
.lista-historial{font-size: 11px; color: #94A3B7; margin: 0 0 6px;}
.hCiudad{display: inline-block; background: #1E3A5F; border-radius: 12px; padding: 3px 10px;
font-size: 12px; margin: 2px; cursor: pointer;}
.hCiudad:hover{background-color: #797f88;}
.actualizacion{margin-top: 12px; padding-top: 12px; color: #94A3B8;}

</style>
<script setup>
import { watch, onMounted, onUnmounted } from 'vue'
import {useWeatherStore} from '../stores/weatherStore'
import {obtenerClima} from '../services/weatherService'

const store = useWeatherStore()
let timer = null

async function cargarClima(){
  store.cargando = true
  store.limpiarError()
  try{
      const datos = await obtenerClima(store.latitud, store.longitud)
  store.setClima(datos.temperatura, datos.viento, datos.codigoClima)


} catch(error) {
  // Axios guarda la respuesta del servidor en error.response
  const mensajeAPI = error.response?.data?.reason  // mensaje de Open-Meteo
  const mensajeHTTP = error.response 
    ? `Error ${error.response.status}: ${error.response.statusText}`
    : null
  
  store.error = mensajeAPI || mensajeHTTP || error.message || "No se puede obtener el clima."
}finally{
  store.cargando = false
}
}
/**Watch: recargar cuando el usuario cambie de ciudad (latitud y longitud)*/
watch(
  [()=> store.latitud, () => store.longitud],
  ()=> cargarClima()
)
onMounted(
  async()=> {
    await cargarClima()
    timer = setInterval(cargarClima, 5*60*1000) //5 minutos
  }
)
onUnmounted(
  () => clearInterval(timer) //destroy timer
)
</script>