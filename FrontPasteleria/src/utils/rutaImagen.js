// Las imágenes guardadas con rutas antiguas también funcionan en /producto/:id.
export function rutaImagen(ruta) {
  if (!ruta || /^(?:[a-z][a-z\d+.-]*:|\/)/i.test(ruta)) return ruta;
  return "/" + ruta.replace(/^(?:\.\.\/|\.\/)+/, "");
}
