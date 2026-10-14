import { Link } from "react-router-dom";
import { BarraNavegacion } from "../../components/estructura/barraNavegacion.jsx";
import { PiePagina } from "../../components/estructura/piePagina.jsx";
import { FilasCarrito } from "../../components/carrito/filasCarrito.jsx";
import { useTienda } from "../../context/ContextoTienda.jsx";
import { useTituloPagina } from "../../hooks/useTituloPagina.js";
import { paginas } from "../../app/pages.js";
import { formatearPrecio } from "../../utils/formatoPrecio.js";
import { totalCarrito } from "../../utils/precios.js";
import estilos from "./carrito.module.css";

export default function Carrito() {
  const { carrito, vaciarCarrito } = useTienda();
  useTituloPagina(paginas.Carrito.title);

  const cantidadTotal = carrito.reduce(
    (acumulado, item) => acumulado + (item.cantidad || 1),
    0
  );

  return (
    <>
      <BarraNavegacion />

      <main className={estilos.pagina}>
        {/* BANNER HERO DEL CARRITO */}
        <section className={estilos.heroCarrito}>
          <div className={estilos.heroContenido}>
            <span className={estilos.subtituloBadge}>{"Tu Pedido"}</span>
            <h1 className={estilos.tituloHero}>{"Carrito de Compras"}</h1>
            <p className={estilos.bajadaHero}>
              {
                "Revisa tus productos seleccionados antes de continuar con la compra."
              }
            </p>
          </div>
        </section>

        <div className="container py-4">
          {carrito.length === 0 ? (
            /* ESTADO VACÍO ELEGANTE */
            <div className={estilos.tarjetaVacio}>
              <div className={estilos.iconoVacioWrapper}>
                <svg
                  className={estilos.iconoVacio}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
              </div>
              <h2 className={estilos.tituloVacio}>{"Tu carrito está vacío"}</h2>
              <p className={estilos.textoVacio}>
                {
                  "¿Aún no te decides? Explora nuestros deliciosos pasteles y panes artesanales."
                }
              </p>
              <Link to="/pasteleria" className={estilos.btnExplorar}>
                {"Ver Productos"}
              </Link>
            </div>
          ) : (
            /* SECCIÓN DE PRODUCTOS Y RESUMEN */
            <div className="row g-4">
              {/* Columna Izquierda: Lista de productos */}
              <div className="col-12 col-lg-8">
                <section id="carrito" className={estilos.contenedorFilas}>
                  <FilasCarrito />
                </section>
              </div>

              {/* Columna Derecha: Tarjeta de Resumen */}
              <div className="col-12 col-lg-4">
                <div className={estilos.tarjetaResumen}>
                  <h3 className={estilos.tituloResumen}>
                    {"Resumen de Compra"}
                  </h3>

                  <div className={estilos.lineaResumen}>
                    <span>{"Cantidad de productos:"}</span>
                    <span className={estilos.valorCantidad}>
                      {cantidadTotal}
                    </span>
                  </div>

                  <hr className={estilos.divisorResumen} />

                  <div className={estilos.lineaTotal}>
                    <span>{"Total a pagar:"}</span>
                    <span className={estilos.montoTotal} id="total">
                      {formatearPrecio(totalCarrito(carrito))}
                    </span>
                  </div>

                  <div className={estilos.accionesCarrito}>
                    <Link className={estilos.btnCheckout} to="/checkout">
                      {"Continuar con la compra"}
                    </Link>

                    <button
                      type="button"
                      id="btn-vaciar"
                      className={estilos.btnVaciar}
                      onClick={vaciarCarrito}
                    >
                      {"Vaciar carrito"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <PiePagina />
    </>
  );
}