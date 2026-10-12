import { createContext, useContext, useState } from "react";
import {
  obtenerProductos,
  guardarProductos,
} from "../services/productos.js";

import { readArray } from "../utils/storage.js";
import { activeUser } from "../services/auth.js";

const Store = createContext(null);

export function StoreProvider({ children }) {
  const [cart, setCart] = useState(() => readArray("carrito"));
  const [user] = useState(activeUser);
  const [productos, setProductos] = useState(obtenerProductos);

  function refrescarProductos() {
    setProductos(obtenerProductos());
  }

  function saveCart(next) {
    localStorage.setItem("carrito", JSON.stringify(next));
    setCart(next);
  }

  function actualizarProductos(nuevosProductos) {
    guardarProductos(nuevosProductos);
    setProductos(nuevosProductos);
  }

  function add(product, quantity) {
    // El catálogo incrementaba con ++; el detalle sumaba la cantidad elegida.
    const text = localStorage.getItem("carrito");
    const next =
      quantity === undefined
        ? readArray("carrito")
        : text
          ? JSON.parse(text)
          : [];
    const existing = next.find((item) => item.id === product.id);
    if (existing) {
      if (quantity === undefined) existing.cantidad++;
      else existing.cantidad += quantity;
    } else {
      const { paginaOrigen, ...data } = product;
      next.push({ ...data, cantidad: quantity ?? 1 });
    }
    saveCart(next);
  }

  function changeQuantity(index, delta) {
    const next = cart.map((item) => ({ ...item }));
    if (delta > 0) next[index].cantidad++;
    else if (next[index].cantidad > 1) next[index].cantidad--;
    else next.splice(index, 1);
    saveCart(next);
  }

  function remove(index) {
    saveCart(cart.filter((_, position) => position !== index));
  }

  function logout() {
    sessionStorage.removeItem("usuarioActivo");
    localStorage.removeItem("usuarioActivo");
    window.location.replace("../InicioSesion/iniciosesion.html");
  }

  return (
    <Store.Provider
      value={{
        productos,
        actualizarProductos,
        refrescarProductos,
        cart,
        user,
        add,
        changeQuantity,
        remove,
        saveCart,
        logout,
      }}
    >
      {children}
    </Store.Provider>
  );
}

export function useStore() {
  return useContext(Store);
}
