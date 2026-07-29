import { db } from '@/config/firebase'
import {
  collection,
  getDocs,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc
} from 'firebase/firestore'

// Referencia a la colección en Firestore
const collectionRef = collection(db, 'servicios')

// ── GET ALL (Firestore) ────────────────────────────────────────────
export async function getServicios() {
  try {
    const querySnapshot = await getDocs(collectionRef)
    const servicios = []
    querySnapshot.forEach((doc) => {
      servicios.push({ id: doc.id, ...doc.data() })
    })
    return servicios
  } catch (error) {
    console.error('[servicioService] Error en getServicios:', error)
    throw new Error('No se pudieron recuperar los servicios del servidor.')
  }
}

// ── GET ONE (Firestore) ────────────────────────────────────────────
export async function getServicio(id) {
  try {
    const docRef = doc(db, 'servicios', id)
    const docSnap = await getDoc(docRef)
    if (!docSnap.exists()) {
      throw new Error(`Servicio con ID ${id} no encontrado.`)
    }
    return { id: docSnap.id, ...docSnap.data() }
  } catch (error) {
    console.error(`[servicioService] Error en getServicio (${id}):`, error)
    throw new Error(error.message || 'Error al obtener los detalles del servicio.')
  }
}

// ── CREATE (Firestore) ─────────────────────────────────────────────
export async function crearServicio(datos) {
  try {
    const ahora = new Date().toISOString()
    const payload = { ...datos, creadoAt: ahora, actualizadoAt: ahora }
    const docRef = await addDoc(collectionRef, payload)
    return { id: docRef.id, ...payload }
  } catch (error) {
    console.error('[servicioService] Error en crearServicio:', error)
    throw new Error('Error al guardar el nuevo servicio.')
  }
}

// ── UPDATE (Firestore) ─────────────────────────────────────────────
export async function actualizarServicio(id, datos) {
  try {
    const docRef = doc(db, 'servicios', id)
    const { id: _, creadoAt, ...resto } = datos
    const payload = { ...resto, actualizadoAt: new Date().toISOString() }
    await updateDoc(docRef, payload)
    return { id, creadoAt, ...payload }
  } catch (error) {
    console.error(`[servicioService] Error en actualizarServicio (${id}):`, error)
    throw new Error('Error al actualizar los datos del servicio.')
  }
}

// ── DELETE (Firestore) ─────────────────────────────────────────────
export async function eliminarServicio(id) {
  try {
    const docRef = doc(db, 'servicios', id)
    await deleteDoc(docRef)
  } catch (error) {
    console.error(`[servicioService] Error en eliminarServicio (${id}):`, error)
    throw new Error('Error al intentar eliminar el servicio.')
  }
}