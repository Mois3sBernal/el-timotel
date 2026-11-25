<script setup>
import { reactive, ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { store, cargarDatos, estaCargando, agregarReserva, actualizarReserva, eliminarReserva } from '../store'
import { dinero } from '../utils/formato'
import { reglas, reglaLlegada, reglaHora, reglaSalida, hoyISO, maxISO } from '../utils/validaciones'
import EstadoCarga from '../components/EstadoCarga.vue'
import CampoFormulario from '../components/CampoFormulario.vue'
import ModalMensaje from '../components/ModalMensaje.vue'
import ListaReservas from '../components/ListaReservas.vue'

const route = useRoute()
const hoy = hoyISO()
const maximo = maxISO()

const formVacio = () => ({
  nombre: '', telefono: '', correo: '',
  llegada: '', hora: '', salida: '',
  habitacionId: '', especial: ''
})
const form = reactive(formVacio())
const intento = ref(false)
const claveForm = ref(0)
const editandoId = ref(null)   // null = reserva nueva; un número = editando esa reserva
const modal = ref(null)

// La habitación elegida en la lista desplegable
const habitacion = computed(() => store.habitaciones.find(h => h.id === Number(form.habitacionId)))

// Regla de negocio: la misma habitación no se reserva dos veces el mismo día
const repetida = computed(() =>
  form.habitacionId !== '' && form.llegada !== '' &&
  store.reservas.some(r =>
    r.habitacionId === Number(form.habitacionId) &&
    r.llegada === form.llegada &&
    r.id !== editandoId.value
  )
)

const errores = computed(() => ({
  nombre: reglas.nombre(form.nombre),
  telefono: reglas.telefono(form.telefono),
  correo: reglas.correoOpcional(form.correo),
  llegada: reglaLlegada(form.llegada, hoy, maximo),
  hora: reglaHora(form.hora, form.llegada, hoy),
  salida: reglaSalida(form.salida, form.llegada, maximo),
  habitacionId: form.habitacionId === '' ? 'Elige una habitación.'
    : repetida.value ? 'Esa habitación ya tiene una reserva para esa fecha. Elige otra habitación u otro día.'
    : ''
}))
const hayErrores = computed(() => Object.values(errores.value).some(e => e !== ''))
const mostrarErrorHab = computed(() => errores.value.habitacionId !== '' && (intento.value || form.habitacionId !== ''))

function guardar() {
  intento.value = true
  if (hayErrores.value) return

  const datos = {
    nombre: form.nombre.trim(),
    telefono: form.telefono,
    correo: form.correo.trim(),
    llegada: form.llegada,
    hora: form.hora,
    salida: form.salida,
    habitacionId: habitacion.value.id,
    habitacionNombre: habitacion.value.nombre,
    precio: habitacion.value.precio,
    especial: form.especial.trim()
  }

  if (editandoId.value === null) {
    datos.id = Date.now()
    datos.codigo = 'TM-' + Math.floor(1000 + Math.random() * 9000)
    agregarReserva(datos)
    modal.value = {
      titulo: 'Reserva registrada',
      texto: '¡Tu reserva ha sido registrada exitosamente! Recibirás en breve una confirmación en el número ' + datos.telefono + '. Gracias por elegir El Timotel.',
      codigo: 'Código: ' + datos.codigo
    }
  } else {
    actualizarReserva(editandoId.value, datos)
    const guardada = store.reservas.find(r => r.id === editandoId.value)
    modal.value = {
      titulo: 'Reserva actualizada',
      texto: 'Los cambios de tu reserva se guardaron correctamente.',
      codigo: 'Código: ' + guardada.codigo
    }
  }
  limpiar()
}

function limpiar() {
  Object.assign(form, formVacio())
  editandoId.value = null
  intento.value = false
  claveForm.value++
}

function editar(id) {
  const reserva = store.reservas.find(r => r.id === id)
  if (!reserva) return
  Object.assign(form, {
    nombre: reserva.nombre,
    telefono: reserva.telefono,
    correo: reserva.correo,
    llegada: reserva.llegada,
    hora: reserva.hora,
    salida: reserva.salida,
    habitacionId: reserva.habitacionId,
    especial: reserva.especial
  })
  editandoId.value = id
  intento.value = false
  claveForm.value++
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function borrar(id) {
  if (!confirm('¿Seguro que quieres eliminar esta reserva?')) return
  eliminarReserva(id)
  if (editandoId.value === id) limpiar()
}

onMounted(async () => {
  await cargarDatos()
  // Si venimos del detalle de una habitación (?hab=3), la dejamos elegida
  const elegida = Number(route.query.hab)
  if (store.habitaciones.some(h => h.id === elegida)) {
    form.habitacionId = elegida
  }
})
</script>

<template>
  <section class="contenedor">
    <h1>Realiza tu reserva</h1>
    <p class="sub">Completa el formulario para asegurar tu habitación.</p>

    <EstadoCarga :cargando="estaCargando" :error="store.error" texto-carga="Cargando habitaciones..." @reintentar="cargarDatos">
      <div class="reserva">
        <form :key="claveForm" class="formulario" novalidate @submit.prevent="guardar">
          <h2>Tus datos</h2>
          <p v-if="editandoId !== null" class="aviso-edicion">Estás editando una reserva guardada.</p>
          <CampoFormulario v-model="form.nombre" label="Nombre completo" placeholder="Ingresa tu nombre completo" :error="errores.nombre" :forzar="intento" />
          <CampoFormulario v-model="form.telefono" label="Teléfono" tipo="tel" placeholder="Ingresa tu número de teléfono" :maxlength="10" :error="errores.telefono" :forzar="intento" />
          <CampoFormulario v-model="form.correo" label="Correo electrónico (opcional)" tipo="email" placeholder="Ingresa tu correo electrónico" :error="errores.correo" :forzar="intento" />

          <h2>Fechas de estancia</h2>
          <div class="dos-campos">
            <CampoFormulario v-model="form.llegada" label="Fecha de llegada" tipo="date" :min="hoy" :max="maximo" :error="errores.llegada" :forzar="intento" />
            <CampoFormulario v-model="form.hora" label="Hora de llegada" tipo="time" :error="errores.hora" :forzar="intento" />
          </div>
          <CampoFormulario v-model="form.salida" label="Fecha de salida" tipo="date" :min="form.llegada || hoy" :max="maximo" :error="errores.salida" :forzar="intento" />

          <label>Habitación
            <select v-model="form.habitacionId" :class="{ invalido: mostrarErrorHab, valido: form.habitacionId !== '' && errores.habitacionId === '' }">
              <option value="">Selecciona el tipo de habitación</option>
              <option v-for="h in store.habitaciones" :key="h.id" :value="h.id">{{ h.nombre }} - {{ dinero(h.precio) }}</option>
            </select>
            <span v-if="mostrarErrorHab" class="msg-error" role="alert">{{ errores.habitacionId }}</span>
          </label>

          <CampoFormulario v-model="form.especial" label="Solicitudes especiales (opcional)" tipo="textarea" :filas="2" placeholder="Cuéntanos si tienes alguna solicitud especial" />

          <button class="boton" type="submit">{{ editandoId === null ? 'Realizar reserva' : 'Guardar cambios' }}</button>
          <button v-if="editandoId !== null" class="boton btn-sec" type="button" @click="limpiar">Cancelar edición</button>
          <p class="peq centro"><i class="fa-solid fa-lock"></i> Tu información está segura con nosotros.</p>
        </form>

        <aside class="resumen" aria-live="polite">
          <template v-if="habitacion">
            <img :src="habitacion.fotos[0].src" :alt="habitacion.nombre" width="400" height="260">
            <h2>{{ habitacion.nombre }}</h2>
            <p class="peq">12 horas de uso</p>
            <p class="precio grande">{{ dinero(habitacion.precio) }}</p>
            <p class="desc">{{ habitacion.descripcion }}</p>
            <ul class="lista-check">
              <li v-for="c in habitacion.caracteristicas" :key="c">{{ c }}</li>
            </ul>
          </template>
          <div v-else class="info-vacio">
            <i class="fa-solid fa-bed icono-ok"></i>
            <h2>Elige tu habitación</h2>
            <p class="peq">Selecciona una habitación y aquí verás su foto, precio y características.</p>
          </div>
        </aside>
      </div>
    </EstadoCarga>
  </section>

  <section class="contenedor" aria-labelledby="tituloReservas">
    <h2 id="tituloReservas">Mis reservas guardadas</h2>
    <p class="peq">Se guardan en este navegador y siguen ahí aunque recargues la página.</p>
    <ListaReservas :reservas="store.reservas" @editar="editar" @eliminar="borrar" />
  </section>

  <ModalMensaje v-if="modal" v-bind="modal" @cerrar="modal = null" />
</template>
