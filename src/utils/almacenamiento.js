export function leerArreglo(clave) {
  try {
    const datos = JSON.parse(localStorage.getItem(clave));
    return Array.isArray(datos) ? datos : [];
  } catch {
    return [];
  }
}
