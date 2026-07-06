const BASE_URL = 'https://open.er-api.com/v6/latest/USD'

/**
 * Obtiene el tipo de cambio actual de USD a MXN
 * @returns {Promise<{ rate: number, fecha: string }>}
 */
export async function obtenerTipoDeCambioUSDaMXN() {
  const response = await fetch(BASE_URL)

  if (!response.ok) {
    throw new Error(`Error al obtener tipo de cambio: ${response.status}`)
  }

  const data = await response.json()

  return {
    rate: data.rates.MXN,
    fecha: data.time_last_update_utc,
  }
}

/**
 * Convierte una cantidad de dólares a pesos mexicanos
 * @param {number} dolares - Cantidad en USD
 * @returns {Promise<{ dolares: number, pesos: number, rate: number, fecha: string }>}
 */
export async function convertirDolaresAPesos(dolares) {
  const { rate, fecha } = await obtenerTipoDeCambioUSDaMXN()

  return {
    dolares,
    pesos: parseFloat((dolares * rate).toFixed(2)),
    rate,
    fecha,
  }
}