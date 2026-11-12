import { categorias } from "../data/categorias.js";

// Dirección del backend (Spring Boot).
const URL_API = "http://localhost:8080/api/productos";

// Hace la petición y convierte los errores HTTP en mensajes para el usuario.
async function pedir(url, opciones = {}) {
  let respuesta;
  try {
    respuesta = await fetch(url, {
      headers: { "Content-Type": "application/json" },
      ...opciones,
    });
  } catch {
    throw new Error("No se pudo conectar con el servidor.");
  }
  if (respuesta.status === 404) throw new Error("Producto no encontrado.");
  if (respuesta.status === 400) throw new Error("Datos del producto inválidos.");
  if (!respuesta.ok) throw new Error("Error del servidor. Intenta de nuevo.");
  // DELETE responde 204 sin contenido.
  return respuesta.status === 204 ? null : respuesta.json();
}

export function obtenerProductos() {
  return pedir(URL_API);
}

// Se valida también en el front para avisar antes de llamar a la API.
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

// El ID lo genera la base de datos.
export function crearProducto(datos) {
  return pedir(URL_API, {
    method: "POST",
    body: JSON.stringify(validarProducto(datos)),
  });
}

export function editarProducto(id, datos) {
  return pedir(`${URL_API}/${id}`, {
    method: "PUT",
    body: JSON.stringify(validarProducto(datos)),
  });
}

export function eliminarProducto(id) {
  return pedir(`${URL_API}/${id}`, { method: "DELETE" });
}
