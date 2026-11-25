// Estado compartido (store): todas las vistas leen y modifican los mismos datos,
// así la información es consistente entre páginas.
import { reactive, computed, watch } from 'vue'
import { cargarJSON } from '../services/api'

const CLAVE_RESERVAS = 'timotel_reservas'
const CLAVE_MENSAJES = 'timotel_mensajes'

function leerLista(clave) {
  try {
    return JSON.parse(localStorage.getItem(clave)) || []
  } catch (error) {
    return []
  }
}

export const store = reactive({
  habitaciones: [],
  servicios: [],
  cargando: false,
  cargado: false,
  error: '',
  reservas: leerLista(CLAVE_RESERVAS),
  mensajes: leerLista(CLAVE_MENSAJES)
})

// Cada vez que cambian las listas, se guardan en localStorage (persisten al recargar)
watch(() => store.reservas, lista => localStorage.setItem(CLAVE_RESERVAS, JSON.stringify(lista)), { deep: true })
watch(() => store.mensajes, lista => localStorage.setItem(CLAVE_MENSAJES, JSON.stringify(lista)), { deep: true })

// true mientras se cargan los datos (también antes de la primera petición)
export const estaCargando = computed(() => store.cargando || (!store.cargado && store.error === ''))

export async function cargarDatos() {
  if (store.cargado || store.cargando) return
  store.cargando = true
  store.error = ''
  try {
    const [habitaciones, servicios] = await Promise.all([
      cargarJSON('data/habitaciones.json'),
      cargarJSON('data/servicios.json')
    ])
    store.habitaciones = habitaciones
    store.servicios = servicios
    store.cargado = true
  } catch (error) {
    store.error = error.message
  } finally {
    store.cargando = false
  }
}

export function agregarReserva(reserva) {
  store.reservas.push(reserva)
}

export function actualizarReserva(id, datos) {
  const posicion = store.reservas.findIndex(r => r.id === id)
  if (posicion !== -1) {
    store.reservas[posicion] = { ...datos, id, codigo: store.reservas[posicion].codigo }
  }
}

export function eliminarReserva(id) {
  store.reservas = store.reservas.filter(r => r.id !== id)
}

export function agregarMensaje(mensaje) {
  store.mensajes.push(mensaje)
}
