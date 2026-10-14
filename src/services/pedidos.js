import { leerArreglo } from "../utils/almacenamiento.js";
import { precioFinal, totalCarrito } from "../utils/precios.js";
import { normalizarCarrito } from "./carrito.js";
export const opcionesEntrega = [
  { id: "domicilio", nombre: "Despacho a domicilio", costo: 3000 },
  { id: "retiro", nombre: "Retiro en tienda", costo: 0 },
];
export function obtenerPedidos() {
  return leerArreglo("pedidosPasteleria");
}
export function pedidosDelUsuario(usuario) {
  if (!usuario?.email) return [];
  return obtenerPedidos()
    .filter((pedido) => pedido.correoCliente === usuario.email.toLowerCase())
    .sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
}
export function crearPedido({ carrito, productos, datos, usuario }) {
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
  const entrega = opcionesEntrega.find((opcion) => opcion.id === datos.entrega);
  if (!entrega) throw new Error("Selecciona una opción de entrega válida.");
  if (datos.pago === "rechazado") return { aprobado: false };
  if (datos.pago !== "aprobado")
    throw new Error("Selecciona el resultado del pago simulado.");
  const pedido = {
    id: crypto.randomUUID(),
    fecha: new Date().toISOString(),
    estado: "confirmado",
    correoCliente: (usuario?.email || cliente.email).toLowerCase(),
    cliente,
    productos: actuales.map((producto) => ({
      ...producto,
      precioFinal: precioFinal(producto),
    })),
    entrega: { ...entrega },
    subtotal: totalCarrito(actuales),
    total: totalCarrito(actuales) + entrega.costo,
  };
  localStorage.setItem(
    "pedidosPasteleria",
    JSON.stringify([...obtenerPedidos(), pedido]),
  );
  return { aprobado: true, pedido };
}
