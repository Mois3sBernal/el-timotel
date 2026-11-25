<script setup>
import { ref } from 'vue'

// Estado del menú del celular: true = abierto
const abierto = ref(false)

const enlaces = [
  { ruta: '/', texto: 'Inicio' },
  { ruta: '/habitaciones', texto: 'Habitaciones' },
  { ruta: '/servicios', texto: 'Servicios' },
  { ruta: '/informacion', texto: 'Información' },
  { ruta: '/contacto', texto: 'Contacto' }
]
</script>

<template>
  <header class="encabezado">
    <RouterLink class="logo" to="/"><i class="fa-solid fa-house-chimney"></i> El Timotel</RouterLink>
    <input id="toggle" v-model="abierto" type="checkbox" class="toggle">
    <label class="btn-menu" for="toggle" aria-label="Abrir menú"><i class="fa-solid fa-bars"></i></label>
    <nav class="menu" aria-label="Navegación principal">
      <ul>
        <li v-for="enlace in enlaces" :key="enlace.ruta">
          <RouterLink
            :to="enlace.ruta"
            :active-class="enlace.ruta === '/' ? '' : 'activo'"
            exact-active-class="activo"
            @click="abierto = false"
          >{{ enlace.texto }}</RouterLink>
        </li>
      </ul>
      <RouterLink class="boton" to="/reservar" @click="abierto = false">Reservar ahora</RouterLink>
    </nav>
  </header>
</template>
