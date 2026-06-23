<template>
  <div class="card">
    <h2>Clima en {{ ciudad }}</h2>
    <p v-if="cargar">Cargando datos...</p>
    <p v-else-if="error" class="error">{{ error }}</p>
    <div v-else>
      <p><b>Temperatura:</b> {{ temperatura }}°C</p>
      <p><b>Viento:</b> {{ viento }} km/h</p>
    </div>
    <button @click="obtenerClima">Ver clima</button>
  </div>

  <div class="searchbox">
    <input
      type="text"
      v-model="busqueda"
      @keyup.enter="obtenerCiudad"
      placeholder="Escriba una ciudad. Ej: Tizimín." 
    />
    <button @click="obtenerCiudad" :disabled="cargarC">
      {{ cargarC ? 'Buscando...' : 'Buscar ciudad' }}
    </button>
    <hr/>
    <div class="ciudadinfo" v-if="ciudadInfo">
      <h2>{{ ciudadInfo.nombre }}</h2>
      <p><b>Nombre completo:</b> {{ ciudadInfo.nombre_completo }}</p>
      <p><small>Tipo: {{ ciudadInfo.tipo }}</small></p>
    </div>
    <p class="error" v-if="ErrorC">{{ ErrorC }}</p>
  </div> 
</template>

<style scoped>
.card {
  border: 1px solid #1d5acb;
  border-radius: 12px;
  padding: 16px;
  max-width: 320px;
  font-family: Andy, Arial, sans-serif;
}

h2 {
  color: #1e3884;
  font-size: 24px;
  margin-bottom: 12px;
}

.error {
  color: #e74c3c;
  font-size: 18px;
}

button {
  background-color: #304b7a;
  color: #ffffff;
  border: 1px solid #25ace1;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 12px;
  cursor: pointer;
}

button:hover {
  background-color: #25ace1;
  color: #ffffff;
  transition: 0.2s;
}
</style>
<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const ciudad = ref('Cancún');
const temperatura = ref(null);
const viento = ref(null);
const cargar = ref(true);
const error = ref(null);
const lat = ref(20.97);
const lng = ref(-87.93);
const busqueda = ref('');
const ciudadInfo = ref(null);
const cargarC = ref(false);
const ErrorC = ref(null);

async function obtenerClima() {
  cargar.value = true;
  error.value = null;
  try {
    const res = await axios.get('https://api.open-meteo.com/v1/forecast', {
      params: {
        latitude: lat.value,
        longitude: lng.value,
        current: 'temperature_2m,wind_speed_10m',
        timezone: 'America/Cancun',
      },
    });
    temperatura.value = res.data.current.temperature_2m;
    viento.value = res.data.current.wind_speed_10m;
  } catch (e) {
    error.value = 'No se pudo obtener el clima';
  } finally {
    cargar.value = false;
  }
}

const obtenerCiudad = async () => {
  if (!busqueda.value) return;
  cargarC.value = true;
  ErrorC.value = null;
  ciudadInfo.value = null;

  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${busqueda.value}&format=json`;
    const { data } = await axios.get(url);

    if (data && data.length > 0) {
      const respuesta = data.find(
        i => i.type === 'city' || i.type === 'town'
      ) || data[0];

      ciudadInfo.value = {
        nombre: respuesta.display_name,
        nombre_completo: respuesta.display_name,
        tipo: respuesta.type,
      };

      // actualizar coordenadas y nombre
      lat.value = respuesta.lat;
      lng.value = respuesta.lon;
      ciudad.value = respuesta.display_name;

      // actualizar clima automáticamente
      await obtenerClima();
    } else {
      ErrorC.value = "Ciudad no localizada";
    }
  } catch (e) {
    ErrorC.value = "Error de conexión";
  } finally {
    cargarC.value = false;
  }
};

onMounted(() => obtenerClima());
</script>
