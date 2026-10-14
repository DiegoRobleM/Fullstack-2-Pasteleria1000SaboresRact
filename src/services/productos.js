import { productosIniciales } from "../data/productos.js";
import { categorias } from "../data/categorias.js";
export function obtenerProductos() {
  try {
    const datos = JSON.parse(localStorage.getItem("productosPasteleria"));
    return Array.isArray(datos) ? datos : productosIniciales;
  } catch {
    return productosIniciales;
  }
}
export function guardarProductos(productos) {
  localStorage.setItem("productosPasteleria", JSON.stringify(productos));
}
function validarProducto(datos) {
  const precio = Number(datos.precio);
  const descuento = Number(datos.descuento ?? 0);
  if (
    !datos.titulo?.trim() ||
    !datos.descripcion?.trim() ||
    !datos.imagen?.trim()
  )
    throw new Error("Completa nombre, descripción e imagen.");
  if (!categorias.some((categoria) => categoria.id === datos.categoria))
    throw new Error("Selecciona una categoría válida.");
  if (!Number.isFinite(precio) || precio <= 0 || !Number.isInteger(precio))
    throw new Error("El precio debe ser un entero mayor que cero.");
  if (!Number.isFinite(descuento) || descuento < 0 || descuento > 100)
    throw new Error("El descuento debe estar entre 0 y 100.");
  return {
    titulo: datos.titulo.trim(),
    descripcion: datos.descripcion.trim(),
    imagen: datos.imagen.trim(),
    categoria: datos.categoria,
    precio,
    descuento,
  };
}
export function crearProducto(datos) {
  const producto = {
    ...validarProducto(datos),
    id: datos.categoria + "-" + crypto.randomUUID(),
  };
  guardarProductos([...obtenerProductos(), producto]);
  return producto;
}
export function editarProducto(id, datos) {
  const productos = obtenerProductos();
  if (!productos.some((producto) => producto.id === id))
    throw new Error("Producto no encontrado.");
  const actualizado = { ...validarProducto(datos), id };
  guardarProductos(
    productos.map((producto) => (producto.id === id ? actualizado : producto)),
  );
  return actualizado;
}
export function eliminarProducto(id) {
  const productos = obtenerProductos();
  if (!productos.some((producto) => producto.id === id))
    throw new Error("Producto no encontrado.");
  guardarProductos(productos.filter((producto) => producto.id !== id));
}
