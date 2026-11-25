// Vue Router: define las rutas de la aplicación (navegación sin recargar la página)
import { createRouter, createWebHashHistory } from 'vue-router'
import InicioView from '../views/InicioView.vue'
import HabitacionesView from '../views/HabitacionesView.vue'
import HabitacionDetalleView from '../views/HabitacionDetalleView.vue'
import ServiciosView from '../views/ServiciosView.vue'
import InformacionView from '../views/InformacionView.vue'
import ContactoView from '../views/ContactoView.vue'
import ReservarView from '../views/ReservarView.vue'
import NoEncontradaView from '../views/NoEncontradaView.vue'

const routes = [
  { path: '/', name: 'inicio', component: InicioView, meta: { titulo: 'Inicio' } },
  { path: '/habitaciones', name: 'habitaciones', component: HabitacionesView, meta: { titulo: 'Habitaciones' } },
  // :id es un parámetro: /habitaciones/3 -> la vista recibe id = "3" como prop
  { path: '/habitaciones/:id', name: 'habitacion', component: HabitacionDetalleView, props: true, meta: { titulo: 'Detalle de habitación' } },
  { path: '/servicios', name: 'servicios', component: ServiciosView, meta: { titulo: 'Servicios' } },
  { path: '/informacion', name: 'informacion', component: InformacionView, meta: { titulo: 'Información' } },
  { path: '/contacto', name: 'contacto', component: ContactoView, meta: { titulo: 'Contacto' } },
  { path: '/reservar', name: 'reservar', component: ReservarView, meta: { titulo: 'Reservar' } },
  { path: '/:pathMatch(.*)*', name: 'no-encontrada', component: NoEncontradaView, meta: { titulo: 'Página no encontrada' } }
]

const router = createRouter({
  // Hash (#/habitaciones) funciona en cualquier alojamiento sin configuración extra
  history: createWebHashHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 })
})

router.afterEach(to => {
  document.title = (to.meta.titulo || 'El Timotel') + ' | El Timotel'
})

export default router
