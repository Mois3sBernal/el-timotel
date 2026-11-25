<script setup>
// Muestra un loader mientras se cargan los datos, un error con botón Reintentar,
// o el contenido (slot) cuando todo salió bien.
defineProps({
  cargando: { type: Boolean, default: false },
  error: { type: String, default: '' },
  textoCarga: { type: String, default: 'Cargando información...' }
})
defineEmits(['reintentar'])
</script>

<template>
  <div v-if="cargando" class="cargando" role="status">
    <span class="spinner"></span>
    <p>{{ textoCarga }}</p>
  </div>
  <div v-else-if="error" class="error-caja" role="alert">
    <p>{{ error }}</p>
    <button type="button" class="boton" @click="$emit('reintentar')">Reintentar</button>
  </div>
  <slot v-else />
</template>
