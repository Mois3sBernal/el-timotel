<script setup>
import { dinero } from '../utils/formato'

defineProps({
  reservas: { type: Array, required: true }
})
// Eventos personalizados hacia el padre: editar y eliminar (llevan el id de la reserva)
defineEmits(['editar', 'eliminar'])
</script>

<template>
  <div class="lista-reservas">
    <p v-if="reservas.length === 0" class="vacio">Aún no tienes reservas guardadas.</p>
    <article v-for="reserva in reservas" :key="reserva.id" class="reserva-item">
      <h3>{{ reserva.habitacionNombre }} ({{ reserva.codigo }})</h3>
      <p>Llegada: {{ reserva.llegada }} a las {{ reserva.hora }} - Salida: {{ reserva.salida }}</p>
      <p>{{ reserva.nombre }} - Tel. {{ reserva.telefono }}</p>
      <p class="precio">{{ dinero(reserva.precio) }} por 12 horas</p>
      <div class="acciones">
        <button type="button" class="boton btn-sec" @click="$emit('editar', reserva.id)">Editar</button>
        <button type="button" class="boton btn-peligro" @click="$emit('eliminar', reserva.id)">Eliminar</button>
      </div>
    </article>
  </div>
</template>
