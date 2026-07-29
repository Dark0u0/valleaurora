import { db } from '../config/firebase'
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
const collectionRef = collection(db, 'propiedades')

// ── GET ALL (Firestore) ────────────────────────────────────────────
export async function getPropiedades() {
  try {
    const querySnapshot = await getDocs(collectionRef)
    const propiedades = []
    querySnapshot.forEach((doc) => {
      propiedades.push({ id: doc.id, ...doc.data() })
    })
    return propiedades
  } catch (error) {
    console.error('[propiedadService] Error en getPropiedades:', error)
    throw new Error('No se pudieron recuperar las propiedades del servidor.')
  }
}

// ── GET ONE (Firestore) ────────────────────────────────────────────
export async function getPropiedad(id) {
  try {
    const docRef = doc(db, 'propiedades', id)
    const docSnap = await getDoc(docRef)
    if (!docSnap.exists()) {
      throw new Error(`Propiedad con ID ${id} no encontrada.`)
    }
    return { id: docSnap.id, ...docSnap.data() }
  } catch (error) {
    console.error(`[propiedadService] Error en getPropiedad (${id}):`, error)
    throw new Error(error.message || 'Error al obtener los detalles de la propiedad.')
  }
}

// ── CREATE (Firestore) ─────────────────────────────────────────────
export async function crearPropiedad(datos) {
  try {
    const ahora = new Date().toISOString()
    const payload = { ...datos, creado: ahora, actualizado: ahora }
    const docRef = await addDoc(collectionRef, payload)
    return { id: docRef.id, ...payload }
  } catch (error) {
    console.error('[propiedadService] Error en crearPropiedad:', error)
    throw new Error('Error al guardar la nueva propiedad.')
  }
}

// ── UPDATE (Firestore) ─────────────────────────────────────────────
export async function actualizarPropiedad(id, datos) {
  try {
    const docRef = doc(db, 'propiedades', id)
    const { id: _, creado, ...resto } = datos
    const payload = { ...resto, actualizado: new Date().toISOString() }
    await updateDoc(docRef, payload)
    return { id, creado, ...payload }
  } catch (error) {
    console.error(`[propiedadService] Error en actualizarPropiedad (${id}):`, error)
    throw new Error('Error al actualizar los datos de la propiedad.')
  }
}

// ── DELETE (Firestore) ─────────────────────────────────────────────
export async function eliminarPropiedad(id) {
  try {
    const docRef = doc(db, 'propiedades', id)
    await deleteDoc(docRef)
  } catch (error) {
    console.error(`[propiedadService] Error en eliminarPropiedad (${id}):`, error)
    throw new Error('Error al intentar eliminar la propiedad.')
  }
}
