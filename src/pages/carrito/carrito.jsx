import { Link } from "react-router-dom";
import { BarraNavegacion } from "../../components/estructura/barraNavegacion.jsx";
import { PiePagina } from "../../components/estructura/piePagina.jsx";
import { FilasCarrito } from "../../components/carrito/filasCarrito.jsx";
import { useTienda } from "../../context/ContextoTienda.jsx";
import { useTituloPagina } from "../../hooks/useTituloPagina.js";
import { paginas } from "../../app/pages.js";
import { formatearPrecio } from "../../utils/formatoPrecio.js";
import { totalCarrito } from "../../utils/precios.js";
export default function Carrito() {
  const { carrito, vaciarCarrito } = useTienda();
  useTituloPagina(paginas.Carrito.title);
  return (
    <>
      <BarraNavegacion />
      <main className="container my-5">
        <h1 className="text-center mb-4">Carrito de compras</h1>
        <section id="carrito">
          <FilasCarrito />
        </section>
        <section className="text-end mt-4">
          <h3>
            Total:{" "}
            <span id="total">{formatearPrecio(totalCarrito(carrito))}</span>
          </h3>
          {carrito.length > 0 && (
            <div className="d-flex flex-wrap justify-content-end gap-3 mt-3">
              <button
                type="button"
                id="btn-vaciar"
                className="btn btn-outline-secondary"
                onClick={vaciarCarrito}
              >
                Vaciar carrito
              </button>
              <Link className="btn botonPasteleria" to="/checkout">
                Continuar con la compra
              </Link>
            </div>
          )}
        </section>
      </main>
      <PiePagina />
    </>
  );
}
