import { createContext, useContext, useState } from "react";

export function readArray(key) {
  try {
    const data = JSON.parse(localStorage.getItem(key));
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export function activeUser() {
  const text =
    sessionStorage.getItem("usuarioActivo") ||
    localStorage.getItem("usuarioActivo");
  try {
    return text ? JSON.parse(text) : null;
  } catch {
    sessionStorage.removeItem("usuarioActivo");
    localStorage.removeItem("usuarioActivo");
    return null;
  }
}

export function createDemoAdministrator() {
  const users = readArray("usuariosRegistrados");
  if (users.some((user) => user && user.email === "admin@pasteleria.test"))
    return;
  users.push({
    nombre: "Administrador",
    apellido: "Demo",
    email: "admin@pasteleria.test",
    password: "AdminDemo123!",
    rol: "admin",
    direccion: "Dirección ficticia",
    tipoPropiedad: "Local",
    region: "metropolitana",
    comuna: "santiago",
    guardarDatos: false,
  });
  localStorage.setItem("usuariosRegistrados", JSON.stringify(users));
}

const Store = createContext(null);

export function StoreProvider({ children }) {
  const [cart, setCart] = useState(() => readArray("carrito"));
  const [user] = useState(activeUser);

  function saveCart(next) {
    localStorage.setItem("carrito", JSON.stringify(next));
    setCart(next);
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
      value={{ cart, user, add, changeQuantity, remove, saveCart, logout }}
    >
      {children}
    </Store.Provider>
  );
}

export function useStore() {
  return useContext(Store);
}
