export function precioFinal(producto) {
  const descuento = Math.min(100, Math.max(0, Number(producto.descuento) || 0));
  return Math.round(Number(producto.precio) * (1 - descuento / 100));
}
export function totalCarrito(carrito) {
  return carrito.reduce(
    (total, producto) => total + precioFinal(producto) * producto.cantidad,
    0,
  );
}
