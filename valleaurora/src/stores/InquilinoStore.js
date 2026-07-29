import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  getInquilinos,
  getInquilino,
  crearInquilino,
  actualizarInquilino,
  eliminarInquilino,
} from '@/services/inquilinoService'
import { getPropiedades } from '@/services/propiedadService'

const FORM_VACIO = () => ({
  nombre:          '',
  apellidos:       '',
  fechaNacimiento: '',
  telefono:        '',
  celular:         '',
  estado:          'activo', // activo | inactivo
  notas:           '',
})

export const useInquilinoStore = defineStore('inquilino', () => {

  // ── Estado ────────────────────────────────────────────────────
  const lista          = ref([])
  const propiedades     = ref([])   // se usa para mostrar qué propiedad tiene asignada el inquilino
  const seleccionada    = ref(null)
  const form            = ref(FORM_VACIO())
  const modoEdicion     = ref(false)
  const cargando        = ref(false)
  const guardando       = ref(false)
  const eliminando      = ref(false)
  const error           = ref(null)
  const exito           = ref(null)

  // ── Getters ───────────────────────────────────────────────────
  const totalInquilinos = computed(() => lista.value.length)

  // ── Helpers ───────────────────────────────────────────────────
  function _notificar(msg) {
    exito.value = msg
    setTimeout(() => { exito.value = null }, 3500)
  }

  // La relación vive en Propiedad.idInquilino, aquí sólo la buscamos "al revés"
  function propiedadDe(idInquilino) {
    return propiedades.value.find(p => p.idInquilino === idInquilino) || null
  }

  // ── CRUD ──────────────────────────────────────────────────────
  async function cargarLista() {
    cargando.value = true
    error.value    = null
    try {
      const [inqs, props] = await Promise.all([getInquilinos(), getPropiedades()])
      lista.value       = inqs
      propiedades.value = props
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
      const data         = await getInquilino(id)
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
        const actualizado = await actualizarInquilino(seleccionada.value, form.value)
        const idx = lista.value.findIndex(i => i.id === actualizado.id)
        if (idx !== -1) lista.value[idx] = actualizado
        _notificar('Inquilino actualizado correctamente.')
      } else {
        const nuevo = await crearInquilino(form.value)
        lista.value.push(nuevo)
        _notificar('Inquilino creado correctamente.')
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
      await eliminarInquilino(id)
      lista.value = lista.value.filter(i => i.id !== id)
      if (seleccionada.value === id) iniciarCrear()
      _notificar('Inquilino eliminado.')
    } catch (e) {
      error.value = e.message
    } finally {
      eliminando.value = false
    }
  }

  return {
    lista, propiedades, seleccionada, form, modoEdicion,
    cargando, guardando, eliminando,
    error, exito,
    totalInquilinos,
    propiedadDe,
    cargarLista,
    iniciarCrear, iniciarEditar,
    guardar, eliminar,
  }
})
