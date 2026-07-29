import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  getPropiedades,
  getPropiedad,
  crearPropiedad,
  actualizarPropiedad,
  eliminarPropiedad,
} from '../services/propiedadService'
import { getUbicaciones } from '../services/ubicacionService'
import { getInquilinos } from '../services/inquilinoService'

// estado:  1 = disponible | 2 = rentado | 3 = mantenimiento
// tipo:    habitacional -> casa | departamento | condominio
//          negocio      -> local | restaurant | bodega
const FORM_VACIO = () => ({
  idUbicacion:  '',
  idInquilino:  '',     // opcional, inquilino actual asignado a la propiedad
  numero:       '',     // número de casa o local
  piso:         0,      // aplica a departamentos/condominios; 0 si no aplica
  m2:           null,
  habitaciones: 1,      // float, pasos de .5
  banos:        1,      // float, pasos de .5 (.5 cuando no tiene regadera)
  rentaMensual: 0,      // MXN
  estado:       1,      // 1 disponible | 2 rentado | 3 mantenimiento
  tipo:         'casa',
  notas:        '',
})

export const usePropiedadStore = defineStore('propiedad', () => {

  // ── Estado ────────────────────────────────────────────────────
  const lista        = ref([])
  const ubicaciones   = ref([])
  const inquilinos    = ref([])
  const seleccionada  = ref(null)
  const form          = ref(FORM_VACIO())
  const modoEdicion   = ref(false)
  const cargando      = ref(false)
  const guardando     = ref(false)
  const eliminando    = ref(false)
  const error         = ref(null)
  const exito         = ref(null)

  // ── Getters ───────────────────────────────────────────────────
  const totalPropiedades = computed(() => lista.value.length)

  // ── Helpers ───────────────────────────────────────────────────
  function _notificar(msg) {
    exito.value = msg
    setTimeout(() => { exito.value = null }, 3500)
  }

  function nombreUbicacion(idUbicacion) {
    const u = ubicaciones.value.find(u => u.id === idUbicacion)
    return u ? u.nombre : 'Sin ubicación'
  }

  function nombreInquilino(idInquilino) {
    const i = inquilinos.value.find(i => i.id === idInquilino)
    return i ? `${i.nombre} ${i.apellidos ?? ''}`.trim() : 'Sin asignar'
  }

  // ── CRUD ──────────────────────────────────────────────────────
  async function cargarLista() {
    cargando.value = true
    error.value    = null
    try {
      const [props, ubis, inqs] = await Promise.all([
        getPropiedades(),
        getUbicaciones(),
        getInquilinos(),
      ])
      lista.value       = props
      ubicaciones.value = ubis
      inquilinos.value  = inqs
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
      const data         = await getPropiedad(id)
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
      if (modoEdicion.value) {
        const actualizada = await actualizarPropiedad(seleccionada.value, form.value)
        const idx = lista.value.findIndex(p => p.id === actualizada.id)
        if (idx !== -1) lista.value[idx] = actualizada
        _notificar('Propiedad actualizada correctamente.')
      } else {
        const nueva = await crearPropiedad(form.value)
        lista.value.push(nueva)
        _notificar('Propiedad creada correctamente.')
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
      await eliminarPropiedad(id)
      lista.value = lista.value.filter(p => p.id !== id)
      if (seleccionada.value === id) iniciarCrear()
      _notificar('Propiedad eliminada.')
    } catch (e) {
      error.value = e.message
    } finally {
      eliminando.value = false
    }
  }

  return {
    lista, ubicaciones, inquilinos, seleccionada, form, modoEdicion,
    cargando, guardando, eliminando,
    error, exito,
    totalPropiedades,
    nombreUbicacion, nombreInquilino,
    cargarLista,
    iniciarCrear, iniciarEditar,
    guardar, eliminar,
  }
})
