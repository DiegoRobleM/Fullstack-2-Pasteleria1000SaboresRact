import { Link, useNavigate, useParams } from "react-router-dom";
import { useRef, useState } from "react";
import estilos from "./detalleProducto.module.css";
import { combinarClases } from "../../utils/combinarClases.js";
import { BarraNavegacion } from "../../components/estructura/barraNavegacion.jsx";
import { PiePagina } from "../../components/estructura/piePagina.jsx";
import Notificacion from "../../components/notificacion/notificacion.jsx";
import notificacion from "../../components/notificacion/notificacion.module.css";
import { PrecioProducto } from "../../components/productos/precioProducto.jsx";
import { useTienda } from "../../context/ContextoTienda.jsx";
import { useNotificacion } from "../../hooks/useNotificacion.js";
import { useTituloPagina } from "../../hooks/useTituloPagina.js";
import { nombreCategoria } from "../../data/categorias.js";
import { rutaImagen } from "../../utils/rutaImagen.js";
import { paginas } from "../../app/pages.js";

export default function DetalleProducto() {
  const { idProducto } = useParams();
  const { productos, agregarProducto } = useTienda();
  const producto = productos.find((actual) => actual.id === idProducto);
  const [cantidad, establecerCantidad] = useState("1");
  const entradaCantidad = useRef(null);
  const { visible, notificar } = useNotificacion();
  const navegar = useNavigate();

  useTituloPagina(
    producto
      ? producto.titulo + " | Pastelería 1000 Sabores"
      : paginas.DetalleProducto.title
  );

  function agregar() {
    const numero = Number(cantidad);
    if (!Number.isSafeInteger(numero) || numero < 1) {
      establecerCantidad("1");
      entradaCantidad.current?.focus();
      return;
    }
    agregarProducto(producto, numero);
    notificar();
  }

  return (
    <>
      <BarraNavegacion />

      <main className={estilos.pagina}>
        {/* BANNER HERO SUPERIOR */}
        <section className={estilos.heroDetalle}>
          <div className={estilos.heroContenido}>
            <span className={estilos.subtituloBadge}>
              {"Especialidades Artesanales"}
            </span>
            <h1 className={estilos.tituloHero}>{"Detalle del Producto"}</h1>
          </div>
        </section>

        <div className="container py-5">
          {/* MENSAJE DE PRODUCTO NO ENCONTRADO */}
          {!producto && (
            <div
              id="mensaje-detalle"
              role="alert"
              className={estilos.tarjetaNoEncontrado}
            >
              <div className={estilos.iconoNoEncontrado}>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </div>
              <p className={estilos.textoNoEncontrado}>
                {idProducto === "sin-seleccion"
                  ? "No hay un producto seleccionado."
                  : "El producto solicitado no existe o ya no está disponible."}
              </p>
              <Link to="/pasteleria" className={estilos.btnVolverCatalogo}>
                {"Volver al catálogo"}
              </Link>
            </div>
          )}

          {/* TARJETA PRINCIPAL DEL DETALLE */}
          {producto && (
            <section
              id="detalle-producto"
              aria-labelledby="detalle-titulo"
              className={estilos.tarjetaProducto}
            >
              <div className="row g-4 align-items-center">
                {/* Columna Izquierda: Imagen */}
                <div className="col-12 col-lg-6">
                  <div className={estilos.contenedorImagen}>
                    <img
                      id="detalle-imagen"
                      src={rutaImagen(producto.imagen)}
                      alt={producto.titulo}
                      className={estilos.imagen}
                    />
                  </div>
                </div>

                {/* Columna Derecha: Información y Acciones */}
                <div className="col-12 col-lg-6">
                  <div className={estilos.cuerpoDetalle}>
                    <span id="detalle-categoria" className={estilos.badgeCategoria}>
                      {nombreCategoria(producto.categoria)}
                    </span>

                    <h1 id="detalle-titulo" className={estilos.titulo}>
                      {producto.titulo}
                    </h1>

                    <p id="detalle-descripcion" className={estilos.descripcion}>
                      {producto.descripcion}
                    </p>

                    <div className={estilos.contenedorPrecio}>
                      <span id="detalle-precio" className={estilos.precio}>
                        <PrecioProducto producto={producto} />
                      </span>
                    </div>

                    <div className={estilos.grupoCantidad}>
                      <label
                        htmlFor="detalle-cantidad"
                        className={estilos.etiquetaCantidad}
                      >
                        {"Cantidad:"}
                      </label>
                      <input
                        type="number"
                        id="detalle-cantidad"
                        min="1"
                        step="1"
                        value={cantidad}
                        onChange={(evento) =>
                          establecerCantidad(evento.target.value)
                        }
                        ref={entradaCantidad}
                        className={estilos.controlCantidad}
                      />
                    </div>

                    <div className={estilos.acciones}>
                      <button
                        type="button"
                        id="btn-agregar-detalle"
                        className={estilos.btnAgregar}
                        onClick={agregar}
                      >
                        <svg
                          className={estilos.iconoBoton}
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <circle cx="9" cy="21" r="1" />
                          <circle cx="20" cy="21" r="1" />
                          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                        </svg>
                        <span>{"Agregar al carrito"}</span>
                      </button>

                      <button
                        type="button"
                        id="btn-volver-catalogo"
                        className={estilos.btnVolver}
                        onClick={() => navegar("/" + producto.categoria)}
                      >
                        {"Volver al catálogo"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          <Notificacion
            id="mensaje-carrito"
            role="status"
            className={combinarClases(
              estilos.mensajeCarrito,
              visible === null
                ? "alert alert-success d-none mt-4"
                : visible
                  ? notificacion.visible
                  : notificacion.oculta
            )}
          >
            🍰 ¡PRODUCTO AGREGADO A TU CARRITO!
          </Notificacion>
        </div>
      </main>

      <PiePagina />
    </>
  );
}