import { Link, useNavigate, useParams } from "react-router-dom";
import { useRef, useState } from "react";
import estilos from "./detalleProducto.module.css";
import { combinarClases } from "../../utils/combinarClases.js";
import { BarraNavegacion } from "../../components/estructura/barraNavegacion.jsx";
import { PiePagina } from "../../components/estructura/piePagina.jsx";
import Notificacion from "../../components/notificacion/notificacion.jsx";
import Alerta from "../../components/alerta/alerta.jsx";
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
      : paginas.DetalleProducto.title,
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
      <main className="container my-5">
        <Alerta id="mensaje-detalle" tipo="warning" visible={!producto}>
          {!producto && (
            <>
              {idProducto === "sin-seleccion"
                ? "No hay un producto seleccionado."
                : "El producto solicitado no existe o ya no está disponible."}{" "}
              <Link to="/pasteleria" className="alert-link">
                Volver al catálogo
              </Link>
            </>
          )}
        </Alerta>
        <section
          id="detalle-producto"
          aria-labelledby="detalle-titulo"
          className={combinarClases(
            estilos.producto,
            "row g-4 align-items-center",
            !producto && "d-none",
          )}
        >
          {producto && (
            <>
              <div className="col-12 col-lg-6">
                <img
                  id="detalle-imagen"
                  src={rutaImagen(producto.imagen)}
                  alt={producto.titulo}
                  className={combinarClases(
                    estilos.imagen,
                    "img-fluid rounded shadow-sm",
                  )}
                />
              </div>
              <div className="col-12 col-lg-6">
                <p
                  id="detalle-categoria"
                  className={combinarClases(
                    estilos.categoria,
                    "text-uppercase text-muted mb-2",
                  )}
                >
                  {nombreCategoria(producto.categoria)}
                </p>
                <h1 id="detalle-titulo" className={estilos.titulo}>
                  {producto.titulo}
                </h1>
                <p
                  id="detalle-descripcion"
                  className={combinarClases(estilos.descripcion, "lead mt-3")}
                >
                  {producto.descripcion}
                </p>
                <p className="fs-3 fw-bold mt-4">
                  <span id="detalle-precio" className={estilos.precio}>
                    <PrecioProducto producto={producto} />
                  </span>
                </p>
                <div className="mb-4">
                  <label
                    htmlFor="detalle-cantidad"
                    className="form-label fw-semibold"
                  >
                    Cantidad
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
                    className={combinarClases(estilos.cantidad, "form-control")}
                  />
                </div>
                <div className="d-flex flex-wrap gap-3">
                  <button
                    type="button"
                    id="btn-agregar-detalle"
                    className="btn btn-outline-success"
                    onClick={agregar}
                  >
                    Agregar al carrito
                  </button>
                  <button
                    type="button"
                    id="btn-volver-catalogo"
                    className="btn btn-outline-secondary"
                    onClick={() => navegar("/" + producto.categoria)}
                  >
                    Volver al catálogo
                  </button>
                </div>
              </div>
            </>
          )}
        </section>
        <Notificacion
          id="mensaje-carrito"
          role="status"
          className={combinarClases(
            estilos.mensajeCarrito,
            visible === null
              ? "d-none mt-4"
              : visible
                ? notificacion.visible
                : notificacion.oculta,
          )}
        >
          🍰 ¡PRODUCTO AGREGADO A TU CARRITO!
        </Notificacion>
      </main>
      <PiePagina />
    </>
  );
}
