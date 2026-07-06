import { defineStore } from "pinia";
import {ref, reactive, computed} from "vue";
import {interpretaCodigo} from "../services/weatherService"

export const useWeatherStore = defineStore('weather', ()=>{
    //estados
    const ciudad = ref('Cancun')
    const latitud = ref(20.97)
    const longitud = ref(-86.93)
    //const temperatura = ref(null)
    //const viento = ref(null)
    const cargando = ref(false)
    const error = ref('')


    /* datos del clima agrupado con reactive */
    const clima =reactive({
    temperatura: null,
    viento: null,
    codigoClima: 0,
    ultimaActualizacion: null
    })
    /*Historial de ciudades consultadas */
    const historial = ref([])


    //computados

    const tieneClima = computed(()=> clima.temperatura !== null)

    const descripcionClima = computed(()=>{
        if(!tieneClima.value) return 'Sin datos'
        if(clima.temperatura > 35) return 'Muy caluroso'
        if(clima.temperatura > 25) return 'Calido'
        if(clima.temperatura > 15) return 'Templado'
        return 'Frío'
    })
    //computada: obtener icono segun el codigo OpenMeteo}
    const iconoClima = computed(()=>{
        tieneClima?interpretaCodigo(clima.codigoClima).emoji:'🌐'
    })

    const tiempoActualizado = computed(()=>{
        if(!clima.ultimaActualizacion) return 'Nunca.'

        const minutos = Math.floor((Date.now()-clima.ultimaActualizacion)/60000)
        if(minutos < 1) return "Hace menos de 1 minuto."
        if(minutos < 60) return `Hace ${minutos} minutos.`
        return `Hace ${Math.floor(minutos/60)} h.`
    })

    //Acciones
    function setCiudad(nombre, lat, lon){
        ciudad.value = nombre
        latitud.value = lat
        longitud.value = lon
        if(!historial.value.includes(nombre)){
            historial.value = [nombre, ...historial.value].slice(0,5)
        }
    }

    function setClima(temp, vientoKmh, codigo){
        clima.temperatura = temp
        clima.viento = vientoKmh
        clima.codigoClima = codigo
        clima.ultimaActualizacion = Date.now()
    }
    function limpiarError(){
        error.value = ''
    }
    //Exponer todo lo que van a poder acceder los componentes
    return{
        ciudad, latitud, longitud, cargando, error,
        clima, historial,
        tieneClima, descripcionClima, 
        iconoClima, tiempoActualizado,
        setCiudad, setClima, limpiarError
    }
    
 })