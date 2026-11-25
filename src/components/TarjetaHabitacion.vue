<script setup>
import { dinero } from '../utils/formato'

// Recibe una habitación por props (datos de padre a hijo)
defineProps({
  habitacion: { type: Object, required: true }
})
</script>

<template>
  <article class="tarjeta">
    <span class="num">{{ habitacion.id }}</span>
    <img :src="habitacion.fotos[0].src" :alt="habitacion.nombre" width="400" height="260" loading="lazy">
    <div class="tarjeta-cuerpo">
      <div class="fila">
        <h3>{{ habitacion.nombre }}</h3>
        <span class="desde">Desde<strong>{{ dinero(habitacion.precio) }}</strong></span>
      </div>
      <p class="peq">12 horas de uso</p>
      <ul class="iconos">
        <li><i class="fa-solid fa-bed"></i>{{ habitacion.camasTexto }}</li>
        <li><i class="fa-solid fa-bath"></i>Baño privado</li>
        <li><i class="fa-solid fa-tv"></i>TV por cable</li>
        <li><i class="fa-solid fa-wifi"></i>Wi-Fi gratis</li>
        <li><i class="fa-solid fa-droplet"></i>Agua caliente</li>
      </ul>
      <RouterLink class="boton" :to="{ name: 'habitacion', params: { id: habitacion.id } }">Ver detalle</RouterLink>
    </div>
  </article>
</template>
