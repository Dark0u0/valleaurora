import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import {
  getServicios,
  getServicio,
  crearServicio,
  actualizarServicio,
  eliminarServicio,
} from '../services/servicioService'

// categoria: 'amenidad' | 'cuota-mantenimiento' | 'reparacion'
// unidad:    'evento' | 'mensual' | 'hora' | 'm2'
const FORM_VACIO = () => ({
  nombre:               '',
  categoria:            'amenidad',
  descripcion:          '',
  precioBase:           0,      // MXN
  unidad:               'evento',
  activo:               true,
  requiereProgramacion: false,
  fecha:                null,   // sólo se guarda si requiereProgramacion = true
  hora:                 null,   // sólo se guarda si requiereProgramacion = true
  duracionEstimada:     null,   // minutos
})

// Datos demo solicitados (sin descripción)
const DATOS_DEMO = [
  { nombre: 'Cuota de mantenimiento', categoria: 'cuota-mantenimiento', precioBase: 1200, unidad: 'mensual', activo: true, requiereProgramacion: false, duracionEstimada: null },
  { nombre: 'Uso de alberca',         categoria: 'amenidad',           precioBase: 500,  unidad: 'evento',  activo: true, requiereProgramacion: true,  duracionEstimada: 120 },
  { nombre: 'Jardinería',             categoria: 'amenidad',           precioBase: 350,  unidad: 'evento',  activo: true, requiereProgramacion: true,  duracionEstimada: 180 },
  { nombre: 'Pintura',                categoria: 'reparacion',         precioBase: 1800, unidad: 'evento',  activo: true, requiereProgramacion: true,  duracionEstimada: 480 },
  { nombre: 'Agua de áreas públicas', categoria: 'cuota-mantenimiento', precioBase: 280,  unidad: 'mensual', activo: true, requiereProgramacion: false, duracionEstimada: null },
  { nombre: 'Reparación de puerta',   categoria: 'reparacion',         precioBase: 450,  unidad: 'evento',  activo: true, requiereProgramacion: true,  duracionEstimada: 60 },
]

export const useServicioStore = defineStore('servicio', () => {

  // ── Estado ────────────────────────────────────────────────────
  const lista        = ref([])
  const seleccionada  = ref(null)
  const form          = ref(FORM_VACIO())
  const modoEdicion   = ref(false)
  const cargando      = ref(false)
  const guardando     = ref(false)
  const eliminando    = ref(false)
  const error         = ref(null)
  const exito         = ref(null)

  // Si se desmarca "requiere programación", limpiamos fecha/hora en vivo
  watch(
    () => form.value.requiereProgramacion,
    (value) => {
      if (!value) {
        form.value.fecha = null
        form.value.hora  = null
      }
    }
  )

  // ── Getters ───────────────────────────────────────────────────
  const totalServicios = computed(() => lista.value.length)

  // ── Helpers ───────────────────────────────────────────────────
  function _notificar(msg) {
    exito.value = msg
    setTimeout(() => { exito.value = null }, 3500)
  }

  // Garantiza que fecha/hora sólo viajen a Firestore si requiereProgramacion = true
  function prepararPayload() {
    const payload = { ...form.value }
    if (!payload.requiereProgramacion) {
      payload.fecha = null
      payload.hora  = null
    }
    return payload
  }

  // ── CRUD ──────────────────────────────────────────────────────
  async function cargarLista() {
    cargando.value = true
    error.value    = null
    try {
      lista.value = await getServicios()
    } catch (e) {
      error.value = e.message
    } finally {
      cargando.value = false
    }
  }

  function iniciarCrear() {
    form.value         = FORM_VACIO()
    seleccionada.value = null
    modoEdicion.value  = false
    error.value        = null
  }

  async function iniciarEditar(id) {
    error.value = null
    try {
      const data         = await getServicio(id)
      form.value         = { ...FORM_VACIO(), ...data }
      seleccionada.value = id
      modoEdicion.value  = true
    } catch (e) {
      error.value = e.message
    }
  }

  async function guardar() {
    guardando.value = true
    error.value     = null
    try {
      const payload = prepararPayload()

      if (modoEdicion.value) {
        const actualizada = await actualizarServicio(seleccionada.value, payload)
        const idx = lista.value.findIndex(s => s.id === actualizada.id)
        if (idx !== -1) lista.value[idx] = actualizada
        _notificar('Servicio actualizado correctamente.')
      } else {
        const nuevo = await crearServicio(payload)
        lista.value.push(nuevo)
        _notificar('Servicio creado correctamente.')
      }
      iniciarCrear()
      return true
    } catch (e) {
      error.value = e.message
      return false
    } finally {
      guardando.value = false
    }
  }

  async function eliminar(id) {
    eliminando.value = true
    error.value      = null
    try {
      await eliminarServicio(id)
      lista.value = lista.value.filter(s => s.id !== id)
      if (seleccionada.value === id) iniciarCrear()
      _notificar('Servicio eliminado.')
    } catch (e) {
      error.value = e.message
    } finally {
      eliminando.value = false
    }
  }

  // ── Sembrar datos demo (los 6 servicios solicitados) ───────────
  async function sembrarDemo() {
    guardando.value = true
    error.value     = null
    try {
      for (const item of DATOS_DEMO) {
        const nuevo = await crearServicio({ ...FORM_VACIO(), ...item })
        lista.value.push(nuevo)
      }
      _notificar('Servicios demo cargados correctamente.')
    } catch (e) {
      error.value = e.message
    } finally {
      guardando.value = false
    }
  }

  return {
    lista, seleccionada, form, modoEdicion,
    cargando, guardando, eliminando,
    error, exito,
    totalServicios,
    cargarLista,
    iniciarCrear, iniciarEditar,
    guardar, eliminar,
    sembrarDemo,
  }
})
