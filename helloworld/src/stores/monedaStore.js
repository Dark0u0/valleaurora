import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { obtenerTipoDeCambioUSDaMXN } from '../services/monedaService.js'

export const useMonedaStore = defineStore('moneda', () => {
  // Estado 
  const rate = ref(null)        // Tipo de cambio 1 USD → MXN
  const fecha = ref(null)       // Fecha de la cotización
  const cargando = ref(false)
  const error = ref(null)

  // Getters
  const tieneDatos = computed(() => rate.value !== null)

  const rateFormateado = computed(() =>
    rate.value
      ? rate.value.toLocaleString('es-MX', {
          style: 'currency',
          currency: 'MXN',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      : null
  )

  // Acciones
  async function cargarTipoDeCambio() {
    cargando.value = true
    error.value = null

    try {
      const resultado = await obtenerTipoDeCambioUSDaMXN()
      rate.value = resultado.rate
      fecha.value = resultado.fecha
    } catch (err) {
      error.value = err.message || 'No se pudo obtener el tipo de cambio'
    } finally {
      cargando.value = false
    }
  }

  function limpiar() {
    rate.value = null
    fecha.value = null
    error.value = null
  }

  return {
    // Estado
    rate,
    fecha,
    cargando,
    error,
    // Getters
    tieneDatos,
    rateFormateado,
    // Acciones
    cargarTipoDeCambio,
    limpiar,
  }
})