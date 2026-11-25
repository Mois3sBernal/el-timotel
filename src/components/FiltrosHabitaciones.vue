<script setup>
// Componente con v-model múltiple: cada filtro avisa al padre con un evento update:...
defineProps({
  texto: { type: String, default: '' },
  camas: { type: String, default: 'todas' },
  orden: { type: String, default: 'ninguno' }
})
defineEmits(['update:texto', 'update:camas', 'update:orden'])
</script>

<template>
  <form class="filtros" aria-label="Filtrar habitaciones" @submit.prevent>
    <label>Buscar por nombre
      <input type="search" :value="texto" placeholder="Ejemplo: Suite" @input="$emit('update:texto', $event.target.value)">
    </label>
    <label>Camas
      <select :value="camas" @change="$emit('update:camas', $event.target.value)">
        <option value="todas">Todas</option>
        <option value="1">1 cama</option>
        <option value="2">2 camas</option>
        <option value="3">3 camas</option>
      </select>
    </label>
    <label>Ordenar por precio
      <select :value="orden" @change="$emit('update:orden', $event.target.value)">
        <option value="ninguno">Sin ordenar</option>
        <option value="menor">Menor a mayor</option>
        <option value="mayor">Mayor a menor</option>
      </select>
    </label>
  </form>
</template>
