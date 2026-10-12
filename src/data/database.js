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

export function crearProducto(datos) {
  const precio = Number(datos.precio);
  const descuento = Number(datos.descuento ?? 0);

  const categorias = [
    "pasteleria",
    "panaderia",
    "salados",
    "sin-azucar",
  ];

  if (
    !datos.titulo?.trim() ||
    !datos.descripcion?.trim() ||
    !datos.imagen?.trim()
  ) {
    throw new Error("Completa nombre, descripción e imagen.");
  }

  if (!categorias.includes(datos.categoria)) {
    throw new Error("Selecciona una categoría válida.");
  }

  if (!Number.isFinite(precio) || precio <= 0) {
    throw new Error("El precio debe ser mayor que cero.");
  }

  if (
    !Number.isFinite(descuento) ||
    descuento < 0 ||
    descuento > 100
  ) {
    throw new Error("El descuento debe estar entre 0 y 100.");
  }

  const producto = {
    ...datos,
    titulo: datos.titulo.trim(),
    descripcion: datos.descripcion.trim(),
    imagen: datos.imagen.trim(),
    precio,
    descuento,
    id: `${datos.categoria}-${crypto.randomUUID()}`,
  };

  guardarProductos([...obtenerProductos(), producto]);

  return producto;
}