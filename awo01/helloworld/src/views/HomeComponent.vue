<!--Estrutura SFC (3 partes: HTML, JS Y CSS)-->
<script setup>
//1. importaciones: otros componentes, servicios composables
import {ref, computed, onMounted} from 'vue'
import {useWeatherStore} from '@stores/weatherStore'
//2. estados locales para declarar datos que van a necesitar nuestro componente
const extra = ref(false)
//3. estado global pero es desde el gestor de pinia
const store = useWeatherStore()
//4. valores computados son derivadas del estado de datos en nuestro store
const iconClima = computed(() =>store.temperatura<25?'-':'+')
//5. ciclo de vida 
onMounted(() => console.log('componente listo'))
</script>
<template>
  <div class="weather-card">
    <span>{{ iconClima }}</span>
    <p>{{ store.temperatura }}°C</p>
    <button class="masinfo" @click="extra=!extra">
    {{ extra?'Ver menos...': 'Ver más...' }}
    </button>
  </div>
</template>
<style scoped>
/* scoped = estilos que se le agregaran a este componente */
.weather-card{
    padding: 24px;
    border-radius: 12px;
}
</style>

v-bind (:)
