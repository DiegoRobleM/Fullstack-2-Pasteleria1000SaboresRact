import { act } from "react";
import { createRoot } from "react-dom/client";
import { MemoryRouter } from "react-router-dom";
import { ProveedorTienda } from "../../src/context/ContextoTienda.jsx";
export const catalogoCasos = [];
export function caso(id, nombre, entrada, esperado, comprobar) {
  catalogoCasos.push({ id, nombre, entrada, esperado });
  it(id + ": " + nombre, comprobar);
}
export const producto = {
  id: "pasteleria-1",
  titulo: "Pastel de prueba",
  descripcion: "Producto para las pruebas",
  imagen: "/Pasteleria/img/pchoco.jpg",
  categoria: "pasteleria",
  precio: 10000,
  descuento: 20,
};
export function entornoComponentes() {
  let raiz,
    contenedor,
    visita = 0;
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    contenedor = document.createElement("div");
    document.body.append(contenedor);
    raiz = createRoot(contenedor);
  });
  afterEach(async () => {
    await act(async () => raiz.unmount());
    contenedor.remove();
  });
  return {
    get contenedor() {
      return contenedor;
    },
    async montar(vista, ruta = "/") {
      await act(async () =>
        raiz.render(
          <MemoryRouter key={++visita} initialEntries={[ruta]}>
            <ProveedorTienda>{vista}</ProveedorTienda>
          </MemoryRouter>,
        ),
      );
    },
    async pulsar(elemento) {
      if (!elemento) throw new Error("No se encontró el botón de la prueba");
      await act(async () => elemento.click());
    },
    async escribir(selector, valor) {
      const elemento = contenedor.querySelector(selector);
      const prototipo =
        elemento.tagName === "TEXTAREA"
          ? HTMLTextAreaElement.prototype
          : elemento.tagName === "SELECT"
            ? HTMLSelectElement.prototype
            : HTMLInputElement.prototype;
      await act(async () => {
        Object.getOwnPropertyDescriptor(prototipo, "value").set.call(
          elemento,
          valor,
        );
        elemento.dispatchEvent(
          new Event(elemento.tagName === "SELECT" ? "change" : "input", {
            bubbles: true,
          }),
        );
      });
    },
    async enviar(selector = "form") {
      await act(async () =>
        contenedor
          .querySelector(selector)
          .dispatchEvent(
            new Event("submit", { bubbles: true, cancelable: true }),
          ),
      );
    },
    boton(texto) {
      return [...contenedor.querySelectorAll("button")].find(
        (boton) => boton.textContent.trim() === texto,
      );
    },
  };
}
