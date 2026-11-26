import { pedirApi } from "./api.js";
import { normalizarCarrito } from "./carrito.js";

// Deben coincidir con las opciones del backend (PedidoService).
export const opcionesEntrega = [
  { id: "domicilio", nombre: "Despacho a domicilio", costo: 3000 },
  { id: "retiro", nombre: "Retiro en tienda", costo: 0 },
];

/**
 * Convierte el pedido del backend a la forma que usan las páginas
 * (cliente, entrega y productos agrupados, id como texto).
 */
export function adaptarPedido(pedido) {
  return {
    id: String(pedido.id),
    fecha: pedido.fecha,
    estado: pedido.estado,
    correoCliente: pedido.correoCliente,
    cliente: {
      nombre: pedido.nombre,
      email: pedido.email,
      direccion: pedido.direccion,
      comuna: pedido.comuna,
      region: pedido.region,
    },
    productos: (pedido.productos || []).map((detalle) => ({
      id: detalle.productoId,
      titulo: detalle.titulo,
      imagen: detalle.imagen,
      categoria: detalle.categoria,
      precio: detalle.precio,
      descuento: detalle.descuento,
      precioFinal: detalle.precioFinal,
      cantidad: detalle.cantidad,
    })),
    entrega: {
      id: pedido.entrega,
      nombre: pedido.entregaNombre,
      costo: pedido.costoEntrega,
    },
    subtotal: pedido.subtotal,
    total: pedido.total,
  };
}

/**
 * Pedidos visibles para el usuario: el administrador ve todos,
 * el cliente solo los suyos y el visitante ninguno.
 */
export async function obtenerPedidos(usuario) {
  if (!usuario?.token) return [];
  const ruta = usuario.rol === "admin" ? "/pedidos" : "/pedidos/mios";
  return (await pedirApi(ruta)).map(adaptarPedido);
}

/**
 * Valida la compra y, si el pago simulado es aprobado, la registra en el backend.
 * Los precios y totales los calcula el servidor.
 */
export async function crearPedido({ carrito, productos, datos }) {
  if (!carrito.length)
    throw new Error("Agrega productos al carrito antes de comprar.");
  const actuales = normalizarCarrito(carrito, productos);
  if (actuales.length !== carrito.length)
    throw new Error("Hay productos no disponibles. Revisa tu carrito.");
  const cliente = Object.fromEntries(
    ["nombre", "email", "direccion", "comuna", "region"].map((clave) => [
      clave,
      String(datos[clave] ?? "").trim(),
    ]),
  );
  cliente.email = cliente.email.toLowerCase();
  if (
    !cliente.nombre ||
    !cliente.email ||
    !cliente.direccion ||
    !cliente.comuna ||
    !cliente.region
  )
    throw new Error("Completa tus datos y la dirección de entrega.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cliente.email))
    throw new Error("Introduce un correo válido.");
  if (!opcionesEntrega.some((opcion) => opcion.id === datos.entrega))
    throw new Error("Selecciona una opción de entrega válida.");
  if (datos.pago === "rechazado") return { aprobado: false };
  if (datos.pago !== "aprobado")
    throw new Error("Selecciona el resultado del pago simulado.");

  const pedido = await pedirApi("/pedidos", {
    metodo: "POST",
    cuerpo: {
      ...cliente,
      entrega: datos.entrega,
      productos: actuales.map(({ id, cantidad }) => ({ id, cantidad })),
    },
  });
  return { aprobado: true, pedido: adaptarPedido(pedido) };
}
