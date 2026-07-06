import axios from 'axios'

const BASE_URL = "https://api.open-meteo.com/v1/forecast"

/** 
 * Obtener el clima de las coordenadas dadas.
 * @param {number} lat Latitud
 * @param {number} lon Longitud
 * @returns {Promise<{temperatura: number, viento: number}>}
*/
export async function obtenerClima(lat, lon){
    const respuesta = await axios.get(BASE_URL, {
        params: {
            latitude: lat,
            longitude: lon,
            current: 'temperature_2m,wind_speed_10m,weathercode',
            timezone: 'auto'
        }
    })
/*
    const server_status={
        data:{...}
        estatus: 200,
        statusText: 'OK',
        headers:{...},
        config:{...}
    }

    */
    const {temperature_2m, wind_speed_10m, weather_code} = respuesta.data.current
    console.log(respuesta.status)
    console.log(respuesta.statusText)
    return {
        temperatura: temperature_2m,
        viento: wind_speed_10m,
        codigoClima: weather_code
    }
    
}
export function interpretaCodigo(code){
    if(code === 0) return {emoji: '☼', desc:'Cielo despejado'}
    if(code <=3) return {emoji: '🌥', desc:'Parcialmente nublado'}
    if(code <=48) return {emoji: '🌫', desc:'Niebla'}
    if(code <=67) return {emoji: '🌧', desc:'Lluvia'}
    if(code <=77) return {emoji: '🌨', desc:'Nieve'}
    if(code <=82) return {emoji: '🌦', desc:'Chubascos'}
    return {emoji: '⛈', desc:'Tormenta'}
}