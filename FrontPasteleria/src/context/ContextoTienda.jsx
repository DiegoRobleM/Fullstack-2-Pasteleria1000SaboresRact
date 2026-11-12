import { createContext, useContext, useEffect, useState } from "react";
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
  // Los productos llegan desde la API, así que parten vacíos.
  const [productos, establecerProductos] = useState([]);
  // El carrito se ajusta al catálogo recién cuando llegan los productos.
  const [carrito, establecerCarrito] = useState(() => leerArreglo("carrito"));
  const [usuario, establecerUsuario] = useState(obtenerUsuarioActivo);
  const [pedidos, establecerPedidos] = useState(obtenerPedidos);
  function guardarCarrito(nuevoCarrito) {
    localStorage.setItem("carrito", JSON.stringify(nuevoCarrito));
    establecerCarrito(nuevoCarrito);
  }
  async function refrescarProductos() {
    try {
      const nuevosProductos = await obtenerProductos();
      guardarCarrito(normalizarCarrito(carrito, nuevosProductos));
      establecerProductos(nuevosProductos);
    } catch (error) {
      console.error(error.message);
    }
  }
  // Carga los productos una sola vez, al abrir la tienda.
  useEffect(() => {
    refrescarProductos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
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
