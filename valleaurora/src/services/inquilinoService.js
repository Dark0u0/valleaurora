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
const collectionRef = collection(db, 'inquilinos')

// ── GET ALL (Firestore) ────────────────────────────────────────────
export async function getInquilinos() {
  try {
    const querySnapshot = await getDocs(collectionRef)
    const inquilinos = []
    querySnapshot.forEach((doc) => {
      inquilinos.push({ id: doc.id, ...doc.data() })
    })
    return inquilinos
  } catch (error) {
    console.error('[inquilinoService] Error en getInquilinos:', error)
    throw new Error('No se pudieron recuperar los inquilinos del servidor.')
  }
}

// ── GET ONE (Firestore) ────────────────────────────────────────────
export async function getInquilino(id) {
  try {
    const docRef = doc(db, 'inquilinos', id)
    const docSnap = await getDoc(docRef)
    if (!docSnap.exists()) {
      throw new Error(`Inquilino con ID ${id} no encontrado.`)
    }
    return { id: docSnap.id, ...docSnap.data() }
  } catch (error) {
    console.error(`[inquilinoService] Error en getInquilino (${id}):`, error)
    throw new Error(error.message || 'Error al obtener los detalles del inquilino.')
  }
}

// ── CREATE (Firestore) ─────────────────────────────────────────────
export async function crearInquilino(datos) {
  try {
    const ahora = new Date().toISOString()
    const payload = { ...datos, creado: ahora, actualizado: ahora }
    const docRef = await addDoc(collectionRef, payload)
    return { id: docRef.id, ...payload }
  } catch (error) {
    console.error('[inquilinoService] Error en crearInquilino:', error)
    throw new Error('Error al guardar el nuevo inquilino.')
  }
}

// ── UPDATE (Firestore) ─────────────────────────────────────────────
export async function actualizarInquilino(id, datos) {
  try {
    const docRef = doc(db, 'inquilinos', id)
    const { id: _, creado, ...resto } = datos
    const payload = { ...resto, actualizado: new Date().toISOString() }
    await updateDoc(docRef, payload)
    return { id, creado, ...payload }
  } catch (error) {
    console.error(`[inquilinoService] Error en actualizarInquilino (${id}):`, error)
    throw new Error('Error al actualizar los datos del inquilino.')
  }
}

// ── DELETE (Firestore) ─────────────────────────────────────────────
export async function eliminarInquilino(id) {
  try {
    const docRef = doc(db, 'inquilinos', id)
    await deleteDoc(docRef)
  } catch (error) {
    console.error(`[inquilinoService] Error en eliminarInquilino (${id}):`, error)
    throw new Error('Error al intentar eliminar el inquilino.')
  }
}
