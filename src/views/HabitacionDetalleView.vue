<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { store, cargarDatos, estaCargando } from '../store'
import { dinero } from '../utils/formato'
import EstadoCarga from '../components/EstadoCarga.vue'

// "id" llega desde la ruta /habitaciones/:id (props: true en el router)
const props = defineProps({
  id: { type: String, required: true }
})

const habitacion = computed(() => store.habitaciones.find(h => h.id === Number(props.id)))
const fotoActual = ref(0)

// Si cambia de habitación, volvemos a la primera foto
watch(() => props.id, () => { fotoActual.value = 0 })

onMounted(cargarDatos)
</script>

<template>
  <section class="contenedor">
    <RouterLink class="enlace" to="/habitaciones"><i class="fa-solid fa-arrow-left"></i> Volver a habitaciones</RouterLink>
    <EstadoCarga :cargando="estaCargando" :error="store.error" texto-carga="Cargando habitación..." @reintentar="cargarDatos">
      <article v-if="habitacion" class="detalle">
        <div class="galeria">
          <span class="disp"><i class="fa-solid fa-circle"></i> Disponible: Sí</span>
          <img :src="habitacion.fotos[fotoActual].src" :alt="habitacion.fotos[fotoActual].alt" width="600" height="400">
          <div class="mini">
            <button
              v-for="(foto, posicion) in habitacion.fotos"
              :key="foto.src"
              type="button"
              :class="{ activa: posicion === fotoActual }"
              :aria-label="'Ver foto ' + (posicion + 1)"
              @click="fotoActual = posicion"
            >
              <img :src="foto.src" alt="" width="120" height="78">
            </button>
          </div>
        </div>
        <div class="info">
          <h1>{{ habitacion.nombre }}</h1>
          <p>12 horas de uso</p>
          <p class="precio grande">{{ dinero(habitacion.precio) }}</p>
          <p>{{ habitacion.descripcion }}</p>
          <h2 class="peq-titulo">Incluye:</h2>
          <ul class="lista-check">
            <li v-for="caracteristica in habitacion.caracteristicas" :key="caracteristica">{{ caracteristica }}</li>
          </ul>
          <RouterLink class="boton" :to="{ name: 'reservar', query: { hab: habitacion.id } }">Reservar esta habitación</RouterLink>
        </div>
      </article>
      <div v-else class="error-caja" role="alert">
        <p>No encontramos esa habitación (error 404).</p>
        <RouterLink class="boton" to="/habitaciones">Ver habitaciones</RouterLink>
      </div>
    </EstadoCarga>
  </section>
</template>
