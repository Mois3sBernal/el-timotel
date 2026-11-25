<script setup>
import { onMounted } from 'vue'
import { store, cargarDatos, estaCargando } from '../store'
import EstadoCarga from '../components/EstadoCarga.vue'

const instalaciones = [
  { foto: 'img/parqueadero.jpg', alt: 'Parqueadero techado', texto: 'Parqueadero' },
  { foto: 'img/wifi.jpg', alt: 'Señal de Wi-Fi gratuito', texto: 'Wi-Fi gratuito' },
  { foto: 'img/terraza.jpg', alt: 'Terraza con vista a la bahía', texto: 'Terraza' },
  { foto: 'img/toallas.jpg', alt: 'Toallas limpias en la habitación', texto: 'Limpieza diaria' }
]

onMounted(cargarDatos)
</script>

<template>
  <section class="banner"><h1><i class="fa-solid fa-house-chimney"></i> El Timotel</h1></section>
  <section class="contenedor">
    <h2 class="centro">Nuestros servicios</h2>
    <p class="centro sub">Todo lo que necesitas para una estadía cómoda y placentera.</p>
    <EstadoCarga :cargando="estaCargando" :error="store.error" texto-carga="Cargando servicios..." @reintentar="cargarDatos">
      <div class="rejilla cuatro">
        <article v-for="servicio in store.servicios" :key="servicio.titulo" class="servicio">
          <i :class="['fa-solid', 'fa-' + servicio.icono]"></i>
          <h3>{{ servicio.titulo }}</h3>
          <p>{{ servicio.texto }}</p>
        </article>
      </div>
    </EstadoCarga>
  </section>
  <section class="contenedor">
    <h2 class="centro">Conoce nuestras instalaciones</h2>
    <div class="rejilla cuatro galeria-inst">
      <figure v-for="item in instalaciones" :key="item.foto">
        <img :src="item.foto" :alt="item.alt" width="400" height="220" loading="lazy">
        <figcaption>{{ item.texto }}</figcaption>
      </figure>
    </div>
  </section>
</template>
