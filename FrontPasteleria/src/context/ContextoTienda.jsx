import { createContext, useContext, useState } from "react";
import { obtenerProductos } from "../services/productos.js";
import { leerArreglo } from "../utils/almacenamiento.js";
import { obtenerUsuarioActivo } from "../services/autenticacion.js";
import {
  agregarAlCarrito,
  cambiarCantidadCarrito,
  normalizarCarrito,
} from "../services/carrito.js";
import { crearPedido, obtenerPedidos } from "../services/pedidos.js";
const ContextoTienda = createContext(null);
export function ProveedorTienda({ children }) {
  const [productos, establecerProductos] = useState(obtenerProductos);
  const [carrito, establecerCarrito] = useState(() =>
    normalizarCarrito(leerArreglo("carrito"), productos),
  );
  const [usuario, establecerUsuario] = useState(obtenerUsuarioActivo);
  const [pedidos, establecerPedidos] = useState(obtenerPedidos);
  function guardarCarrito(nuevoCarrito) {
    localStorage.setItem("carrito", JSON.stringify(nuevoCarrito));
    establecerCarrito(nuevoCarrito);
  }
  function refrescarProductos() {
    const nuevosProductos = obtenerProductos();
    guardarCarrito(normalizarCarrito(carrito, nuevosProductos));
    establecerProductos(nuevosProductos);
  }
  function refrescarUsuario() {
    establecerUsuario(obtenerUsuarioActivo());
  }
  function agregarProducto(producto, cantidad = 1) {
    guardarCarrito(agregarAlCarrito(carrito, producto, cantidad));
  }
  function cambiarCantidad(id, variacion) {
    guardarCarrito(cambiarCantidadCarrito(carrito, id, variacion));
  }
  function quitarProducto(id) {
    guardarCarrito(carrito.filter((producto) => producto.id !== id));
  }
  function vaciarCarrito() {
    guardarCarrito([]);
  }
  function cerrarSesion() {
    sessionStorage.removeItem("usuarioActivo");
    localStorage.removeItem("usuarioActivo");
    establecerUsuario(null);
  }
  function confirmarCompra(datos) {
    const resultado = crearPedido({ carrito, productos, datos, usuario });
    if (resultado.aprobado) {
      establecerPedidos(obtenerPedidos());
      vaciarCarrito();
    }
    return resultado;
  }
  return (
    <ContextoTienda.Provider
      value={{
        productos,
        carrito,
        usuario,
        pedidos,
        refrescarProductos,
        refrescarUsuario,
        agregarProducto,
        cambiarCantidad,
        quitarProducto,
        vaciarCarrito,
        cerrarSesion,
        confirmarCompra,
      }}
    >
      {children}
    </ContextoTienda.Provider>
  );
}
export function useTienda() {
  return useContext(ContextoTienda);
}
