import { productosIniciales } from "./productos.js";

export function obtenerProductos() {
  try {
    const datos = JSON.parse(
      localStorage.getItem("productosPasteleria"),
    );

    return Array.isArray(datos) ? datos : productosIniciales;
  } catch {
    return productosIniciales;
  }
}

export function guardarProductos(productos) {
  localStorage.setItem(
    "productosPasteleria",
    JSON.stringify(productos),
  );
}