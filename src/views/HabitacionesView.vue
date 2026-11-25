<script setup>
import { reactive, computed, onMounted } from 'vue'
import { store, cargarDatos, estaCargando } from '../store'
import EstadoCarga from '../components/EstadoCarga.vue'
import TarjetaHabitacion from '../components/TarjetaHabitacion.vue'
import FiltrosHabitaciones from '../components/FiltrosHabitaciones.vue'

const filtros = reactive({ texto: '', camas: 'todas', orden: 'ninguno' })

// Se recalcula sola cada vez que cambia un filtro o llegan los datos
const filtradas = computed(() => {
  const texto = filtros.texto.trim().toLowerCase()
  let lista = store.habitaciones.filter(h => h.nombre.toLowerCase().includes(texto))
  if (filtros.camas !== 'todas') {
    lista = lista.filter(h => h.camas === Number(filtros.camas))
  }
  if (filtros.orden === 'menor') lista.sort((a, b) => a.precio - b.precio)
  if (filtros.orden === 'mayor') lista.sort((a, b) => b.precio - a.precio)
  return lista
})

function limpiarFiltros() {
  filtros.texto = ''
  filtros.camas = 'todas'
  filtros.orden = 'ninguno'
}

onMounted(cargarDatos)
</script>

<template>
  <section class="contenedor">
    <h1 class="centro">Nuestras habitaciones</h1>
    <p class="centro sub">Elige la habitación perfecta para tu descanso. Todas incluyen comodidad, seguridad y atención 24 horas.</p>

    <FiltrosHabitaciones v-model:texto="filtros.texto" v-model:camas="filtros.camas" v-model:orden="filtros.orden" />

    <EstadoCarga :cargando="estaCargando" :error="store.error" texto-carga="Cargando habitaciones..." @reintentar="cargarDatos">
      <p class="peq centro" aria-live="polite">{{ filtradas.length }} de {{ store.habitaciones.length }} habitaciones</p>
      <div class="rejilla">
        <TarjetaHabitacion v-for="habitacion in filtradas" :key="habitacion.id" :habitacion="habitacion" />
        <div v-if="filtradas.length === 0" class="vacio">
          <p>No encontramos habitaciones con esos filtros.</p>
          <button type="button" class="boton" @click="limpiarFiltros">Limpiar filtros</button>
        </div>
      </div>
    </EstadoCarga>
  </section>
</template>
