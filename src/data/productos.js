import {
  Pasteleria,
  Panaderia,
  Salados,
  SinAzucar,
} from "../products.js";

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