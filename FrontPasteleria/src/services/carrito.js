export function normalizarCarrito(datos, productos) {
  const resultado = [];
  for (const entrada of datos) {
    const producto = productos.find((actual) => actual.id === entrada?.id);
    const cantidad = Number(entrada?.cantidad);
    if (!producto || !Number.isSafeInteger(cantidad) || cantidad < 1) continue;
    const existente = resultado.find((actual) => actual.id === producto.id);
    if (existente) existente.cantidad += cantidad;
    else resultado.push({ ...producto, cantidad });
  }
  return resultado;
}
export function agregarAlCarrito(carrito, producto, cantidad = 1) {
  if (!Number.isSafeInteger(cantidad) || cantidad < 1)
    throw new Error("La cantidad debe ser un entero mayor que cero.");
  const existente = carrito.find((entrada) => entrada.id === producto.id);
  if (existente && !Number.isSafeInteger(existente.cantidad + cantidad))
    throw new Error("La cantidad es demasiado grande.");
  return existente
    ? carrito.map((entrada) =>
        entrada.id === producto.id
          ? { ...producto, cantidad: entrada.cantidad + cantidad }
          : entrada,
      )
    : [...carrito, { ...producto, cantidad }];
}
export function cambiarCantidadCarrito(carrito, id, variacion) {
  return carrito
    .map((producto) =>
      producto.id === id
        ? { ...producto, cantidad: producto.cantidad + variacion }
        : producto,
    )
    .filter((producto) => producto.cantidad > 0);
}
