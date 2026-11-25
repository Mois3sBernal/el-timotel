<script setup>
import { computed, onMounted } from 'vue'
import { store, cargarDatos, estaCargando } from '../store'
import EstadoCarga from '../components/EstadoCarga.vue'
import TarjetaHabitacion from '../components/TarjetaHabitacion.vue'

// Solo las 3 primeras habitaciones
const destacadas = computed(() => store.habitaciones.slice(0, 3))

onMounted(cargarDatos)
</script>

<template>
  <section class="hero">
   <picture>
  <source media="(min-width: 768px)" srcset="/img/portada.jpg">
  <img src="/img/portada.jpg" alt="Terraza del hospedaje con vista a la bahía" width="1400" height="440">
</picture>
    <div class="hero-texto">
      <h1>El Timotel</h1>
      <p>El puerto de tu descanso</p>
    </div>
  </section>

  <section class="destacados" aria-label="Ventajas">
    <article><i class="fa-regular fa-clock"></i><h2>24 horas</h2><p>Atención y servicio las 24 horas del día.</p></article>
    <article><i class="fa-solid fa-bed"></i><h2>Habitaciones cómodas</h2><p>Ambientes limpios y acogedores.</p></article>
    <article><i class="fa-solid fa-shield-halved"></i><h2>Seguridad</h2><p>Tu tranquilidad es nuestra prioridad.</p></article>
  </section>

  <section class="contenedor">
    <div class="fila">
      <h2>Nuestras habitaciones</h2>
      <RouterLink class="enlace" to="/habitaciones">Ver todas</RouterLink>
    </div>
    <EstadoCarga :cargando="estaCargando" :error="store.error" texto-carga="Cargando habitaciones..." @reintentar="cargarDatos">
      <div class="rejilla">
        <TarjetaHabitacion v-for="habitacion in destacadas" :key="habitacion.id" :habitacion="habitacion" />
      </div>
    </EstadoCarga>
  </section>
</template>
