<template>
  <DashboardLayout>
    <template #navbar><NavBar /></template>
  <div class="bg-white rounded-2xl shadow-sm p-6">

    <!-- ── Encabezado ──────────────────────────────────────────── -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h2 class="text-2xl font-bold text-slate-800">Propiedades</h2>
        <p class="text-sm text-slate-400 mt-0.5">
          {{ store.totalPropiedades }} propiedad{{ store.totalPropiedades !== 1 ? 'es' : '' }} registrada{{ store.totalPropiedades !== 1 ? 's' : '' }}
        </p>
      </div>
      <button
        @click="store.iniciarCrear(); mostrarForm = true"
        class="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        Nueva propiedad
      </button>
    </div>

    <!-- ── Toast éxito ─────────────────────────────────────────── -->
    <transition name="fade">
      <div v-if="store.exito"
        class="flex items-center gap-2 mb-4 px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-200 text-sm text-emerald-700">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
        {{ store.exito }}
      </div>
    </transition>

    <!-- ── Error global ────────────────────────────────────────── -->
    <div v-if="store.error && !mostrarForm"
      class="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600">
      {{ store.error }}
    </div>

    <!-- ── Layout principal ────────────────────────────────────── -->
    <div class="flex flex-col xl:flex-row gap-6">

      <!-- ── Tabla ─────────────────────────────────────────────── -->
      <div class="flex-1 min-w-0">

        <div v-if="store.cargando" class="flex flex-col gap-3">
          <div v-for="i in 3" :key="i" class="h-14 rounded-xl bg-slate-100 animate-pulse"></div>
        </div>

        <div v-else-if="store.lista.length === 0"
          class="flex flex-col items-center justify-center py-16 text-slate-400 text-sm gap-2">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 21h18M5 21V7l7-4 7 4v14M9 9h1m4 0h1m-6 4h1m4 0h1m-6 4h1m4 0h1"/></svg>
          <span>Sin propiedades registradas</span>
        </div>

        <div v-else class="overflow-x-auto rounded-xl border border-slate-100">
          <table class="w-full text-sm">
            <thead>
              <tr class="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide">
                <th class="text-left px-4 py-3 font-medium">Número</th>
                <th class="text-left px-4 py-3 font-medium">Tipo</th>
                <th class="text-left px-4 py-3 font-medium">Ubicación</th>
                <th class="text-left px-4 py-3 font-medium">Piso</th>
                <th class="text-left px-4 py-3 font-medium">m² / Hab / Baños</th>
                <th class="text-left px-4 py-3 font-medium">Renta</th>
                <th class="text-left px-4 py-3 font-medium">Estado</th>
                <th class="text-left px-4 py-3 font-medium">Inquilino</th>
                <th class="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-for="p in store.lista" :key="p.id"
                class="hover:bg-slate-50 transition-colors"
                :class="store.seleccionada === p.id ? 'bg-indigo-50' : ''">
                <td class="px-4 py-3 font-medium text-slate-800 whitespace-nowrap">{{ p.numero }}</td>
                <td class="px-4 py-3 whitespace-nowrap">
                  <span class="px-2 py-0.5 rounded-full text-xs font-medium" :class="claseTipo(p.tipo)">
                    {{ etiquetaTipo(p.tipo) }}
                  </span>
                </td>
                <td class="px-4 py-3 text-slate-500 whitespace-nowrap">{{ store.nombreUbicacion(p.idUbicacion) }}</td>
                <td class="px-4 py-3 text-slate-500 whitespace-nowrap">{{ p.piso }}</td>
                <td class="px-4 py-3 text-slate-500 whitespace-nowrap">{{ p.m2 ?? '—' }} m² · {{ p.habitaciones }} hab · {{ p.banos }} baños</td>
                <td class="px-4 py-3 text-slate-600 whitespace-nowrap">{{ formatoMXN(p.rentaMensual) }}</td>
                <td class="px-4 py-3 whitespace-nowrap">
                  <span :class="['px-2 py-0.5 rounded-full text-xs font-semibold', claseEstado(p.estado)]">
                    {{ etiquetaEstado(p.estado) }}
                  </span>
                </td>
                <td class="px-4 py-3 text-slate-500 whitespace-nowrap">{{ store.nombreInquilino(p.idInquilino) }}</td>
                <td class="px-4 py-3 whitespace-nowrap">
                  <div class="flex items-center gap-2 justify-end">
                    <button @click="editar(p.id)"
                      class="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors" title="Editar">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    </button>
                    <button @click="confirmarEliminar(p)" :disabled="store.eliminando"
                      class="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors" title="Eliminar">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- ── Formulario CRUD ──────────────────────────────────── -->
      <transition name="slide">
        <div v-if="mostrarForm"
          class="w-full xl:w-[500px] shrink-0 border border-slate-200 rounded-2xl overflow-hidden flex flex-col">

          <!-- Header -->
          <div class="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
            <h3 class="text-sm font-semibold text-slate-700">
              {{ store.modoEdicion ? 'Editar propiedad' : 'Nueva propiedad' }}
            </h3>
            <button @click="cerrarForm"
              class="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors" aria-label="Cerrar">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>

          <!-- Body scrollable -->
          <div class="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-5">

            <div v-if="store.error"
              class="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600">
              {{ store.error }}
            </div>

            <!-- Ubicación y tipo -->
            <fieldset>
              <legend class="text-xs font-semibold text-indigo-600 uppercase tracking-widest mb-3">Ubicación y tipo</legend>
              <div class="flex flex-col gap-3">
                <div class="flex flex-col gap-1">
                  <label class="text-xs font-medium text-slate-500 uppercase tracking-wide">Sucursal / Ubicación</label>
                  <select v-model="store.form.idUbicacion"
                    class="rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition">
                    <option value="" disabled>Selecciona una ubicación</option>
                    <option v-for="u in store.ubicaciones" :key="u.id" :value="u.id">{{ u.nombre }}</option>
                  </select>
                  <p v-if="store.ubicaciones.length === 0" class="text-xs text-amber-600 mt-1">
                    No hay ubicaciones registradas. Crea una primero en el módulo de Ubicaciones.
                  </p>
                </div>

                <CampoSelect v-model="store.form.tipo" label="Tipo de propiedad">
                  <optgroup label="Habitacional">
                    <option value="casa">Casa</option>
                    <option value="departamento">Departamento</option>
                    <option value="condominio">Condominio</option>
                  </optgroup>
                  <optgroup label="Negocio">
                    <option value="local">Local</option>
                    <option value="restaurant">Restaurant</option>
                    <option value="bodega">Bodega</option>
                  </optgroup>
                </CampoSelect>
              </div>
            </fieldset>

            <!-- Datos del inmueble -->
            <fieldset>
              <legend class="text-xs font-semibold text-indigo-600 uppercase tracking-widest mb-3">Datos del inmueble</legend>
              <div class="grid grid-cols-2 gap-3">
                <CampoInput v-model="store.form.numero" label="Número (casa / local)" placeholder="102-A" class-extra="col-span-2" />
                <CampoInput v-model.number="store.form.piso" label="Piso (deptos/condominios)" placeholder="0" type="number" />
                <CampoInput v-model.number="store.form.m2" label="m² (metros cuadrados)" placeholder="65" type="number" />
                <CampoInput v-model.number="store.form.habitaciones" label="Habitaciones" placeholder="2" type="number" step="0.5" />
                <CampoInput v-model.number="store.form.banos" label="Baños (.5 sin regadera)" placeholder="1.5" type="number" step="0.5" />
              </div>
            </fieldset>

            <!-- Renta y estado -->
            <fieldset>
              <legend class="text-xs font-semibold text-indigo-600 uppercase tracking-widest mb-3">Renta y estado</legend>
              <div class="grid grid-cols-2 gap-3">
                <CampoInput v-model.number="store.form.rentaMensual" label="Renta mensual (MXN)" placeholder="8500" type="number" step="0.01" class-extra="col-span-2" />
                <div class="flex flex-col gap-1 col-span-2">
                  <label class="text-xs font-medium text-slate-500 uppercase tracking-wide">Estado</label>
                  <select v-model.number="store.form.estado"
                    class="rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition">
                    <option :value="1">1 · Disponible</option>
                    <option :value="2">2 · Rentado</option>
                    <option :value="3">3 · Mantenimiento</option>
                  </select>
                </div>
              </div>
            </fieldset>

            <!-- Inquilino asignado -->
            <fieldset>
              <legend class="text-xs font-semibold text-indigo-600 uppercase tracking-widest mb-3">Inquilino asignado (opcional)</legend>
              <div class="flex flex-col gap-1">
                <label class="text-xs font-medium text-slate-500 uppercase tracking-wide">Inquilino</label>
                <select v-model="store.form.idInquilino"
                  class="rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition">
                  <option value="">Sin asignar</option>
                  <option v-for="i in store.inquilinos" :key="i.id" :value="i.id">{{ i.nombre }} {{ i.apellidos }}</option>
                </select>
                <p v-if="store.inquilinos.length === 0" class="text-xs text-amber-600 mt-1">
                  No hay inquilinos registrados todavía.
                </p>
              </div>
            </fieldset>

            <!-- Notas -->
            <fieldset>
              <legend class="text-xs font-semibold text-indigo-600 uppercase tracking-widest mb-3">Notas</legend>
              <textarea v-model="store.form.notas" rows="3" placeholder="Observaciones adicionales"
                class="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 bg-white placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition resize-none"></textarea>
            </fieldset>

          </div>

          <!-- Footer -->
          <div class="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50">
            <button type="button" @click="cerrarForm"
              class="px-5 py-2 rounded-xl border border-slate-200 text-sm text-slate-600 hover:bg-slate-100 transition-colors">
              Cancelar
            </button>
            <button type="button" @click="ejecutarGuardar" :disabled="store.guardando"
              class="px-6 py-2 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors flex items-center gap-2">
              <div v-if="store.guardando" class="w-3.5 h-3.5 rounded-full border-2 border-white/40 border-t-white animate-spin"></div>
              {{ store.guardando ? 'Guardando…' : store.modoEdicion ? 'Actualizar' : 'Guardar' }}
            </button>
          </div>

        </div>
      </transition>
    </div>

    <!-- ── Modal confirmación eliminar ────────────────────────── -->
    <div v-if="itemAEliminar"
      class="fixed inset-0 z-50 flex items-center justify-center p-4"
      style="background:rgba(0,0,0,0.35)"
      @click.self="itemAEliminar = null">
      <div class="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm">
        <h4 class="text-base font-semibold text-slate-800 mb-2">¿Eliminar propiedad?</h4>
        <p class="text-sm text-slate-500 mb-6">
          Se eliminará la propiedad <strong class="text-slate-700">{{ itemAEliminar.numero }}</strong> de forma permanente.
        </p>
        <div class="flex justify-end gap-3">
          <button @click="itemAEliminar = null"
            class="px-5 py-2 rounded-xl border border-slate-200 text-sm text-slate-600 hover:bg-slate-100 transition-colors">
            Cancelar
          </button>
          <button @click="ejecutarEliminar" :disabled="store.eliminando"
            class="px-5 py-2 rounded-xl bg-red-600 text-white text-sm font-medium hover:bg-red-700 disabled:opacity-60 transition-colors flex items-center gap-2">
            <div v-if="store.eliminando" class="w-3.5 h-3.5 rounded-full border-2 border-white/40 border-t-white animate-spin"></div>
            {{ store.eliminando ? 'Eliminando…' : 'Sí, eliminar' }}
          </button>
        </div>
      </div>
    </div>

  </div>
  </DashboardLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { usePropiedadStore } from '@/stores/PropiedadStore'
import CampoInput from '@/components/CampoInput.vue'
import CampoSelect from '@/components/CampoSelect.vue'
import DashboardLayout from '../layouts/DashboardLayout.vue'
import NavBar from '../components/NavBar.vue'

const store         = usePropiedadStore()
const mostrarForm    = ref(false)
const itemAEliminar  = ref(null)

onMounted(() => store.cargarLista())

async function editar(id) {
  await store.iniciarEditar(id)
  mostrarForm.value = true
}

function cerrarForm() {
  mostrarForm.value = false
  store.iniciarCrear()
}

function confirmarEliminar(item) { itemAEliminar.value = item }

async function ejecutarEliminar() {
  await store.eliminar(itemAEliminar.value.id)
  itemAEliminar.value = null
}

async function ejecutarGuardar() {
  const exito = await store.guardar()
  if (exito) mostrarForm.value = false
}

const ESTADOS = { 1: 'Disponible', 2: 'Rentado', 3: 'Mantenimiento' }
const ESTADOS_CLASE = {
  1: 'bg-emerald-50 text-emerald-700',
  2: 'bg-indigo-50 text-indigo-700',
  3: 'bg-amber-50 text-amber-700',
}
function etiquetaEstado(estado) { return ESTADOS[estado] || estado }
function claseEstado(estado) { return ESTADOS_CLASE[estado] || 'bg-slate-100 text-slate-500' }

const TIPOS = {
  casa:         { etiqueta: 'Casa',         clase: 'bg-blue-50 text-blue-700' },
  departamento: { etiqueta: 'Departamento', clase: 'bg-blue-50 text-blue-700' },
  condominio:   { etiqueta: 'Condominio',   clase: 'bg-blue-50 text-blue-700' },
  local:        { etiqueta: 'Local',        clase: 'bg-purple-50 text-purple-700' },
  restaurant:   { etiqueta: 'Restaurant',   clase: 'bg-purple-50 text-purple-700' },
  bodega:       { etiqueta: 'Bodega',       clase: 'bg-purple-50 text-purple-700' },
}
function etiquetaTipo(tipo) { return TIPOS[tipo]?.etiqueta || tipo }
function claseTipo(tipo) { return TIPOS[tipo]?.clase || 'bg-slate-100 text-slate-500' }

function formatoMXN(valor) {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(valor || 0)
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.25s; }
.fade-enter-from, .fade-leave-to       { opacity: 0; }
.slide-enter-active, .slide-leave-active { transition: all 0.25s ease; }
.slide-enter-from, .slide-leave-to       { opacity: 0; transform: translateX(16px); }
</style>
