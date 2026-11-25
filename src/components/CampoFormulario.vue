<script setup>
import { ref, computed } from 'vue'

// Campo de formulario reutilizable. Funciona con v-model:
// recibe modelValue (props) y avisa los cambios con update:modelValue (emit).
const props = defineProps({
  modelValue: { type: [String, Number], default: '' },
  label: { type: String, required: true },
  tipo: { type: String, default: 'text' },
  error: { type: String, default: '' },
  forzar: { type: Boolean, default: false },
  placeholder: { type: String, default: '' },
  min: { type: String, default: undefined },
  max: { type: String, default: undefined },
  maxlength: { type: Number, default: undefined },
  filas: { type: Number, default: 3 }
})
const emit = defineEmits(['update:modelValue'])

const tocado = ref(false) // true cuando el usuario ya escribió o salió del campo

const mostrarError = computed(() => (tocado.value || props.forzar) && props.error !== '')
const esValido = computed(() => tocado.value && props.error === '' && String(props.modelValue).trim() !== '')

function alEscribir(evento) {
  tocado.value = true
  emit('update:modelValue', evento.target.value)
}
</script>

<template>
  <label>{{ label }}
    <textarea
      v-if="tipo === 'textarea'"
      :value="modelValue"
      :rows="filas"
      :placeholder="placeholder"
      :maxlength="maxlength"
      :class="{ invalido: mostrarError, valido: esValido }"
      @input="alEscribir"
      @blur="tocado = true"
    ></textarea>
    <input
      v-else
      :type="tipo"
      :value="modelValue"
      :placeholder="placeholder"
      :min="min"
      :max="max"
      :maxlength="maxlength"
      :class="{ invalido: mostrarError, valido: esValido }"
      @input="alEscribir"
      @blur="tocado = true"
    >
    <span v-if="mostrarError" class="msg-error" role="alert">{{ error }}</span>
  </label>
</template>
