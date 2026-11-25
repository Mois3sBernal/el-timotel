// Servicio de datos: pide archivos JSON con fetch + async/await
// y convierte los códigos HTTP en mensajes claros para el usuario.
export async function cargarJSON(ruta) {
  let respuesta
  try {
    respuesta = await fetch(ruta)
  } catch (error) {
    throw new Error('No hay conexión con el servidor. Revisa tu internet e inténtalo de nuevo.')
  }
  if (respuesta.status === 404) {
    throw new Error('No se encontró el archivo ' + ruta + ' (error 404).')
  }
  if (respuesta.status >= 500) {
    throw new Error('El servidor tiene problemas en este momento (error ' + respuesta.status + '). Intenta más tarde.')
  }
  if (!respuesta.ok) {
    throw new Error('Ocurrió un error inesperado (código ' + respuesta.status + ').')
  }
  return await respuesta.json()
}
