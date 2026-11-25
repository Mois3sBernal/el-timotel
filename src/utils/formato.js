// 60000 -> "$60.000"
export function dinero(numero) {
  return '$' + Number(numero).toLocaleString('es-CO')
}
