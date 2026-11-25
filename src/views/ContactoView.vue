<script setup>
import { reactive, ref, computed } from 'vue'
import { agregarMensaje } from '../store'
import { reglas } from '../utils/validaciones'
import CampoFormulario from '../components/CampoFormulario.vue'
import ModalMensaje from '../components/ModalMensaje.vue'

const LIMITE = 300

const formVacio = () => ({ nombre: '', telefono: '', correo: '', asunto: '', mensaje: '' })
const form = reactive(formVacio())
const intento = ref(false)   // true después de pulsar "Enviar" (muestra todos los errores)
const claveForm = ref(0)     // al cambiarla, el formulario se vuelve a crear limpio
const modal = ref(null)      // datos de la ventana de mensaje (null = cerrada)

// Errores calculados: se actualizan solos mientras el usuario escribe
const errores = computed(() => ({
  nombre: reglas.nombre(form.nombre),
  telefono: reglas.telefono(form.telefono),
  correo: reglas.correoObligatorio(form.correo),
  asunto: reglas.asunto(form.asunto),
  mensaje: reglas.mensaje(form.mensaje, LIMITE)
}))
const hayErrores = computed(() => Object.values(errores.value).some(e => e !== ''))

function enviar() {
  intento.value = true
  if (hayErrores.value) return
  agregarMensaje({
    id: Date.now(),
    fecha: new Date().toLocaleString('es-CO'),
    nombre: form.nombre.trim(),
    telefono: form.telefono,
    correo: form.correo.trim(),
    asunto: form.asunto.trim(),
    mensaje: form.mensaje.trim()
  })
  modal.value = {
    titulo: '¡Gracias por comunicarte con nosotros!',
    texto: 'En breve un asesor se pondrá en contacto contigo.'
  }
  Object.assign(form, formVacio())
  intento.value = false
  claveForm.value++
}
</script>

<template>
  <section class="banner"><h1><i class="fa-solid fa-house-chimney"></i> El Timotel</h1></section>
  <section class="contenedor">
    <h2 class="centro">Contáctanos</h2>
    <p class="centro sub">Estamos aquí para ayudarte. Escríbenos o visítanos, será un gusto atenderte.</p>
    <div class="dos">
      <aside class="datos">
        <p><i class="fa-solid fa-location-dot"></i><span><strong>Dirección</strong><br>Cra#21 10A 12, Sahagún, Córdoba, Colombia</span></p>
        <p><i class="fa-solid fa-phone"></i><span><strong>Teléfono</strong><br>3104563427</span></p>
        <p><i class="fa-solid fa-envelope"></i><span><strong>Correo</strong><br>hospedajeeltimotel06@hotmail.com</span></p>
        <p><i class="fa-regular fa-clock"></i><span><strong>Horario de atención</strong><br>Lunes a domingo, atención 24 horas</span></p>
      </aside>

      <form :key="claveForm" class="formulario" novalidate @submit.prevent="enviar">
        <h3>Envíanos un mensaje</h3>
        <CampoFormulario v-model="form.nombre" label="Nombre completo" placeholder="Tu nombre" :error="errores.nombre" :forzar="intento" />
        <div class="dos-campos">
          <CampoFormulario v-model="form.telefono" label="Teléfono" tipo="tel" placeholder="3001234567" :maxlength="10" :error="errores.telefono" :forzar="intento" />
          <CampoFormulario v-model="form.correo" label="Correo electrónico" tipo="email" placeholder="correo@ejemplo.com" :error="errores.correo" :forzar="intento" />
        </div>
        <CampoFormulario v-model="form.asunto" label="Asunto" placeholder="Asunto" :error="errores.asunto" :forzar="intento" />
        <CampoFormulario v-model="form.mensaje" label="Mensaje" tipo="textarea" :filas="4" placeholder="Escribe tu mensaje" :error="errores.mensaje" :forzar="intento" />
        <small class="contador">{{ form.mensaje.length }} / {{ LIMITE }}</small>
        <button class="boton" type="submit">Enviar mensaje</button>
      </form>
    </div>
    <h3>Encuéntranos</h3>
    <iframe class="mapa" title="Mapa de El Timotel" loading="lazy" src="https://www.google.com/maps?q=Sahagun,+Cordoba,+Colombia&output=embed"></iframe>
  </section>

  <ModalMensaje v-if="modal" v-bind="modal" @cerrar="modal = null" />
</template>
