import { categorias } from "../data/categorias.js";
import { pedirApi } from "./api.js";

// Ver es público; crear, editar y eliminar requieren token de administrador.
export function obtenerProductos() {
  return pedirApi("/productos");
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
  return pedirApi("/productos", {
    metodo: "POST",
    cuerpo: validarProducto(datos),
  });
}

export function editarProducto(id, datos) {
  return pedirApi(`/productos/${id}`, {
    metodo: "PUT",
    cuerpo: validarProducto(datos),
  });
}

export function eliminarProducto(id) {
  return pedirApi(`/productos/${id}`, { metodo: "DELETE" });
}
