import { createContext, useContext, useEffect, useState } from "react";
import { obtenerProductos } from "../services/productos.js";
import { EVENTO_SESION_EXPIRADA } from "../services/api.js";
import { leerArreglo } from "../utils/almacenamiento.js";
import {
  cerrarSesionGuardada,
  obtenerUsuarioActivo,
} from "../services/autenticacion.js";
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
  // Los pedidos vienen del backend según la sesión (admin: todos; cliente: los suyos).
  const [pedidos, establecerPedidos] = useState([]);
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
  async function refrescarPedidos(usuarioActual = usuario) {
    try {
      establecerPedidos(await obtenerPedidos(usuarioActual));
    } catch (error) {
      console.error(error.message);
    }
  }
  // Si el token venció, api.js avisa y se cierra la sesión en pantalla.
  useEffect(() => {
    window.addEventListener(EVENTO_SESION_EXPIRADA, cerrarSesion);
    return () => window.removeEventListener(EVENTO_SESION_EXPIRADA, cerrarSesion);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // Recarga los pedidos cada vez que cambia la sesión.
  useEffect(() => {
    refrescarPedidos(usuario);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usuario?.token]);
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
    cerrarSesionGuardada();
    establecerUsuario(null);
    establecerPedidos([]);
  }
  async function confirmarCompra(datos) {
    const resultado = await crearPedido({ carrito, productos, datos });
    if (resultado.aprobado) {
      // Se agrega al estado para que la página de compra lo muestre de inmediato,
      // también cuando compra un visitante sin sesión.
      establecerPedidos((actuales) => [resultado.pedido, ...actuales]);
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
        refrescarPedidos,
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
