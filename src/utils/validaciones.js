// Reglas de validación: cada una recibe el valor y devuelve un mensaje de error
// (o un texto vacío si todo está bien).
export const hoyISO = () => new Date().toLocaleDateString('en-CA') // AAAA-MM-DD

export function maxISO() {
  const limite = new Date()
  limite.setFullYear(limite.getFullYear() + 1)
  return limite.toLocaleDateString('en-CA')
}

export const reglas = {
  nombre: v =>
    v.trim().length < 3 ? 'Escribe tu nombre completo (mínimo 3 letras).'
    : !/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/.test(v) ? 'El nombre solo puede tener letras y espacios.'
    : '',
  telefono: v =>
    !/^3[0-9]{9}$/.test(v) ? 'Escribe un celular de 10 dígitos que empiece por 3 (ejemplo: 3104563427).' : '',
  correoOpcional: v =>
    v !== '' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? 'El correo no es válido (ejemplo: nombre@correo.com).' : '',
  correoObligatorio: v =>
    v === '' ? 'Escribe tu correo electrónico.' : reglas.correoOpcional(v),
  asunto: v =>
    v.trim().length < 3 ? 'Escribe un asunto (mínimo 3 letras).' : '',
  mensaje: (v, limite = 300) =>
    v.trim().length < 10 ? 'El mensaje debe tener al menos 10 caracteres.'
    : v.length > limite ? 'El mensaje no puede pasar de ' + limite + ' caracteres.'
    : ''
}

export function reglaLlegada(v, hoy, maximo) {
  if (v === '') return 'Selecciona la fecha de llegada.'
  if (v < hoy) return 'La fecha de llegada no puede ser anterior a hoy.'
  if (v > maximo) return 'Solo se puede reservar hasta dentro de un año.'
  return ''
}

export function reglaHora(v, llegada, hoy) {
  if (v === '') return 'Selecciona la hora de llegada.'
  if (llegada === hoy && v < new Date().toTimeString().slice(0, 5)) return 'Esa hora ya pasó.'
  return ''
}

export function reglaSalida(v, llegada, maximo) {
  if (v === '') return 'Selecciona la fecha de salida.'
  if (llegada !== '' && v < llegada) return 'La salida no puede ser antes de la llegada.'
  if (v > maximo) return 'Solo se puede reservar hasta dentro de un año.'
  return ''
}
