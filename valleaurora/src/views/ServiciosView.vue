<template>
  <DashboardLayout>
    <template #navbar>
      <NavBar />
    </template>
    <div class="bg-white rounded-2xl shadow-sm p-6">

      <!-- ── Encabezado ──────────────────────────────────────────── -->
      <div class="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h2 class="text-2xl font-bold text-slate-800">Servicios</h2>
          <p class="text-sm text-slate-400 mt-0.5">
            {{ store.totalServicios }} servicio{{ store.totalServicios !== 1 ? 's' : '' }} registrado{{ store.totalServicios !== 1 ? 's' : '' }}
          </p>
        </div>
        <div class="flex items-center gap-2">
          <button
            v-if="store.lista.length === 0"
            @click="store.sembrarDemo()"
            :disabled="store.guardando"
            class="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50"
          >
            Cargar datos demo
          </button>
          <button @click="store.iniciarCrear(); mostrarForm = true"
            class="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
              stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Nuevo servicio
          </button>
        </div>
      </div>

      <!-- ── Toast éxito ─────────────────────────────────────────── -->
      <transition name="fade">
        <div v-if="store.exito"
          class="flex items-center gap-2 mb-4 px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-200 text-sm text-emerald-700">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
            stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <polyline points="20 6 9 17 4 12" />
          </svg>
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
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l2.5 2.5"/></svg>
            <span>Sin servicios registrados</span>
          </div>

          <div v-else class="overflow-x-auto rounded-xl border border-slate-100">
            <table class="w-full text-sm">
              <thead>
                <tr class="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide">
                  <th class="text-left px-4 py-3 font-medium">Servicio</th>
                  <th class="text-left px-4 py-3 font-medium">Categoría</th>
                  <th class="text-left px-4 py-3 font-medium">Precio</th>
                  <th class="text-left px-4 py-3 font-medium">Unidad</th>
                  <th class="text-left px-4 py-3 font-medium">Programación</th>
                  <th class="text-left px-4 py-3 font-medium">Estado</th>
                  <th class="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                <tr v-for="s in store.lista" :key="s.id" class="hover:bg-slate-50 transition-colors">
                  <td class="px-4 py-3">
                    <p class="font-medium text-slate-800">{{ s.nombre }}</p>
                    <p v-if="s.descripcion" class="text-xs text-slate-400 mt-0.5 max-w-xs truncate">{{ s.descripcion }}</p>
                  </td>
                  <td class="px-4 py-3">
                    <span class="px-2.5 py-1 rounded-full text-xs font-medium" :class="categoriaClase(s.categoria)">
                      {{ categoriaEtiqueta(s.categoria) }}
                    </span>
                  </td>
                  <td class="px-4 py-3 font-semibold text-slate-800 whitespace-nowrap">
                    {{ formatoMXN(s.precioBase) }}
                  </td>
                  <td class="px-4 py-3 text-slate-500 whitespace-nowrap capitalize">{{ s.unidad }}</td>
                  <td class="px-4 py-3 text-slate-500 whitespace-nowrap text-xs">
                    <span v-if="s.requiereProgramacion">{{ s.fecha || 'sin fecha' }} {{ s.hora || '' }}</span>
                    <span v-else class="italic text-slate-300">No aplica</span>
                  </td>
                  <td class="px-4 py-3">
                    <span class="px-2.5 py-1 rounded-full text-xs font-medium"
                      :class="s.activo ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-400'">
                      {{ s.activo ? 'Activo' : 'Inactivo' }}
                    </span>
                  </td>
                  <td class="px-4 py-3 whitespace-nowrap">
                    <div class="flex items-center gap-2 justify-end">
                      <button @click="editar(s.id)"
                        class="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                        title="Editar">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                          stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </button>
                      <button @click="confirmarEliminar(s)" :disabled="store.eliminando"
                        class="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Eliminar">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                          stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                          <path d="M10 11v6" />
                          <path d="M14 11v6" />
                          <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                        </svg>
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
            class="w-full xl:w-[460px] shrink-0 border border-slate-200 rounded-2xl overflow-hidden flex flex-col">

            <div class="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
              <h3 class="text-sm font-semibold text-slate-700">
                {{ store.modoEdicion ? 'Editar servicio' : 'Nuevo servicio' }}
              </h3>
              <button @click="cerrarForm"
                class="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
                aria-label="Cerrar">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                  stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div class="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-4">

              <div v-if="store.error" class="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600">
                {{ store.error }}
              </div>

              <CampoInput v-model="store.form.nombre" label="Nombre del servicio" placeholder="Ej. Uso de alberca" />

              <CampoSelect v-model="store.form.categoria" label="Categoría">
                <option value="amenidad">Amenidad</option>
                <option value="cuota-mantenimiento">Cuota de mantenimiento</option>
                <option value="reparacion">Reparación</option>
              </CampoSelect>

              <div class="flex flex-col gap-1">
                <label class="text-xs font-medium text-slate-500 uppercase tracking-wide">Descripción</label>
                <textarea v-model="store.form.descripcion" rows="2" placeholder="Detalle del servicio (opcional)…"
                  class="rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"></textarea>
              </div>

              <div class="grid grid-cols-2 gap-3">
                <CampoInput v-model.number="store.form.precioBase" label="Precio base (MXN)" type="number"
                  step="0.01" placeholder="500" />
                <CampoSelect v-model="store.form.unidad" label="Unidad">
                  <option value="evento">Por evento</option>
                  <option value="mensual">Mensual</option>
                  <option value="hora">Por hora</option>
                  <option value="m2">Por m² (metros cuadrados)</option>
                </CampoSelect>
              </div>

              <CampoInput v-model.number="store.form.duracionEstimada" label="Duración estimada (minutos)" type="number"
                placeholder="60" />

              <div class="flex flex-col gap-3 pt-2">
                <label class="flex items-center gap-2.5 text-sm text-slate-700 cursor-pointer">
                  <input type="checkbox" v-model="store.form.requiereProgramacion"
                    class="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-400" />
                  Requiere programación (fecha/hora)
                </label>
                <div v-if="store.form.requiereProgramacion" class="flex flex-col gap-3 pt-2">
                  <CampoInput v-model="store.form.fecha" label="Fecha" type="date" />
                  <CampoInput v-model="store.form.hora" label="Hora" type="time" />
                </div>
              </div>

              <div class="flex flex-col gap-3 pt-2">
                <label class="flex items-center gap-2.5 text-sm text-slate-700 cursor-pointer">
                  <input type="checkbox" v-model="store.form.activo"
                    class="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-400" />
                  Servicio activo (disponible para nuevas solicitudes)
                </label>
              </div>

            </div>

            <div class="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50">
              <button @click="cerrarForm"
                class="px-5 py-2 rounded-xl border border-slate-200 text-sm text-slate-600 hover:bg-slate-100 transition-colors">
                Cancelar
              </button>
              <button @click="ejecutarGuardar" :disabled="store.guardando"
                class="px-6 py-2 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 disabled:opacity-60 transition-colors flex items-center gap-2">
                <div v-if="store.guardando"
                  class="w-3.5 h-3.5 rounded-full border-2 border-white/40 border-t-white animate-spin"></div>
                {{ store.guardando ? 'Guardando…' : store.modoEdicion ? 'Actualizar' : 'Guardar' }}
              </button>
            </div>

          </div>
        </transition>
      </div>

      <!-- ── Modal confirmación eliminar ────────────────────────── -->
      <div v-if="itemAEliminar" class="fixed inset-0 z-50 flex items-center justify-center p-4"
        style="background:rgba(0,0,0,0.35)" @click.self="itemAEliminar = null">
        <div class="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm">
          <h4 class="text-base font-semibold text-slate-800 mb-2">¿Eliminar servicio?</h4>
          <p class="text-sm text-slate-500 mb-6">
            Se eliminará <strong class="text-slate-700">{{ itemAEliminar.nombre }}</strong> de forma permanente.
          </p>
          <div class="flex justify-end gap-3">
            <button @click="itemAEliminar = null"
              class="px-5 py-2 rounded-xl border border-slate-200 text-sm text-slate-600 hover:bg-slate-100 transition-colors">
              Cancelar
            </button>
            <button @click="ejecutarEliminar" :disabled="store.eliminando"
              class="px-5 py-2 rounded-xl bg-red-600 text-white text-sm font-medium hover:bg-red-700 disabled:opacity-60 transition-colors flex items-center gap-2">
              <div v-if="store.eliminando"
                class="w-3.5 h-3.5 rounded-full border-2 border-white/40 border-t-white animate-spin"></div>
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
import { useServicioStore } from '@/stores/ServicioStore'
import CampoInput from '@/components/CampoInput.vue'
import CampoSelect from '@/components/CampoSelect.vue'
import DashboardLayout from '../layouts/DashboardLayout.vue'
import NavBar from '../components/NavBar.vue'

const store = useServicioStore()
const mostrarForm = ref(false)
const itemAEliminar = ref(null)

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

const data_categoria = {
  'amenidad':            { etiqueta: 'Amenidad',              clase: 'bg-blue-50 text-blue-700' },
  'cuota-mantenimiento': { etiqueta: 'Cuota de mantenimiento', clase: 'bg-purple-50 text-purple-700' },
  'reparacion':          { etiqueta: 'Reparación',             clase: 'bg-amber-50 text-amber-700' },
}
function categoriaEtiqueta(c) { return data_categoria[c]?.etiqueta ?? c }
function categoriaClase(c) { return data_categoria[c]?.clase ?? 'bg-slate-100 text-slate-600' }

function formatoMXN(valor) {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(valor || 0)
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.25s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateX(16px);
}
</style>