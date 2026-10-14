import { Pasteleria, Panaderia, Salados, SinAzucar } from "./catalogo.js";

function prepararProductos(productos, categoria) {
  return productos.map((producto) => ({
    ...producto,
    categoria,
    descuento: 0,
  }));
}

export const productosIniciales = [
  ...prepararProductos(Pasteleria, "pasteleria"),
  ...prepararProductos(Panaderia, "panaderia"),
  ...prepararProductos(Salados, "salados"),
  ...prepararProductos(SinAzucar, "sin-azucar"),
];
