<script setup>
import { ref, onMounted } from 'vue'

defineProps({
  titulo: { type: String, required: true },
  texto: { type: String, default: '' },
  codigo: { type: String, default: '' },
  icono: { type: String, default: 'fa-circle-check' }
})
// Evento personalizado: avisa al padre que la ventana se cerró
const emit = defineEmits(['cerrar'])

const dialogo = ref(null)
onMounted(() => dialogo.value.showModal())
</script>

<template>
  <dialog ref="dialogo" class="modal" @close="emit('cerrar')">
    <i :class="['fa-solid', icono, 'icono-ok']"></i>
    <h2>{{ titulo }}</h2>
    <p>{{ texto }}</p>
    <p v-if="codigo" class="codigo">{{ codigo }}</p>
    <button type="button" class="boton" @click="dialogo.close()">Aceptar</button>
  </dialog>
</template>
