<template>
  <div class="moneda-card">
    <!-- Encabezado -->
    <div class="moneda-card__header">
      <span class="moneda-card__icono">💵</span>
      <span class="moneda-card__titulo">Dólar / Peso MXN</span>
    </div>

    <!-- Cargando -->
    <div v-if="store.cargando" class="moneda-card__estado">
      <span class="moneda-card__spinner" />
      <span>Obteniendo cotización...</span>
    </div>

    <!-- Error -->
    <div v-else-if="store.error" class="moneda-card__estado moneda-card__estado--error">
      <span>⚠️ {{ store.error }}</span>
      <button class="moneda-card__btn" @click="store.cargarTipoDeCambio()">
        Reintentar
      </button>
    </div>

    <!-- Datos -->
    <template v-else-if="store.tieneDatos">
      <div class="moneda-card__cuerpo">
        <p class="moneda-card__label">1 USD equivale a</p>
        <p class="moneda-card__rate">{{ store.rateFormateado }}</p>
        <p class="moneda-card__fecha">Cotización del {{ fechaFormateada }}</p>
      </div>

      <button class="moneda-card__btn" @click="store.cargarTipoDeCambio()">
        Actualizar
      </button>
    </template>

    <!-- Estado inicial -->
    <div v-else class="moneda-card__estado">
      <button class="moneda-card__btn moneda-card__btn--primario" @click="store.cargarTipoDeCambio()">
        Ver cotización
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useMonedaStore } from '../stores/monedaStore.js'

const store = useMonedaStore()

// Formatea la fecha a español: "9 de junio de 2025"
const fechaFormateada = computed(() => {
  if (!store.fecha) return ''
  return new Date(store.fecha).toLocaleDateString('es-MX', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
})

// Carga automáticamente al montar el componente
onMounted(() => {
  store.cargarTipoDeCambio()
})
</script>

<style scoped>
.moneda-card {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 1.5rem;
  max-width: 280px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  font-family: system-ui, sans-serif;
}

.moneda-card__header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.moneda-card__icono {
  font-size: 1.4rem;
}

.moneda-card__titulo {
  font-size: 0.875rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.moneda-card__cuerpo {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.moneda-card__label {
  font-size: 0.8rem;
  color: #9ca3af;
  margin: 0;
}

.moneda-card__rate {
  font-size: 2rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
  line-height: 1.2;
}

.moneda-card__fecha {
  font-size: 0.75rem;
  color: #9ca3af;
  margin: 0;
}

.moneda-card__estado {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.875rem;
  color: #6b7280;
  text-align: center;
  padding: 0.5rem 0;
}

.moneda-card__estado--error {
  color: #dc2626;
}

.moneda-card__spinner {
  width: 20px;
  height: 20px;
  border: 2px solid #e5e7eb;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  display: inline-block;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.moneda-card__btn {
  background: transparent;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 0.4rem 0.9rem;
  font-size: 0.8rem;
  color: #374151;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
}

.moneda-card__btn:hover {
  background: #f3f4f6;
  border-color: #9ca3af;
}

.moneda-card__btn--primario {
  background: #3b82f6;
  border-color: #3b82f6;
  color: #ffffff;
}

.moneda-card__btn--primario:hover {
  background: #2563eb;
  border-color: #2563eb;
}
</style>