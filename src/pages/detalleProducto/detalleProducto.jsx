import { combinarClases } from "../../utils/combinarClases.js";
import estilos from "./detalleProducto.module.css";
import Notificacion from "../../components/notificacion/notificacion.jsx";
import { Navbar } from "../../components/layout/Navbar.jsx";
import { Footer } from "../../components/layout/Footer.jsx";

// Estructura y textos de la pantalla original, conservados en JSX.
export default function DetalleProducto({ props = {}, content = {} }) {
  return (
    <>
      {"\n    "}
      <Navbar />
      {"\n\n    "}
      <main className="container my-5">
        {"\n      "}
        <div
          id="mensaje-detalle"
          className="alert alert-warning d-none"
          role="alert"
          {...props["mensaje-detalle"]}
        >
          {content["mensaje-detalle"] ?? <></>}
        </div>
        {"\n\n      "}
        <section
          id="detalle-producto"
          aria-labelledby="detalle-titulo"
          {...props["detalle-producto"]}
          className={combinarClases(estilos.producto, props["detalle-producto"]?.className ?? "row g-4 align-items-center")}
        >
          {content["detalle-producto"] ?? (
            <>
              {"\n        "}
              <div className="col-12 col-lg-6">
                {"\n          "}
                <img
                  id="detalle-imagen"
                  alt=""
                  {...props["detalle-imagen"]}
                  className={combinarClases(estilos.imagen, props["detalle-imagen"]?.className ?? "img-fluid rounded shadow-sm")}
                />
                {"\n        "}
              </div>
              {"\n\n        "}
              <div className="col-12 col-lg-6">
                {"\n          "}
                <p
                  id="detalle-categoria"
                  {...props["detalle-categoria"]}
                  className={combinarClases(estilos.categoria, props["detalle-categoria"]?.className ?? "text-uppercase text-muted mb-2")}
                >
                  {content["detalle-categoria"] ?? (
                    <>{"\n            Categoría por cargar\n          "}</>
                  )}
                </p>
                {"\n\n          "}
                <h1 id="detalle-titulo" {...props["detalle-titulo"]} className={estilos.titulo}>
                  {content["detalle-titulo"] ?? (
                    <>{"\n            Cargando producto...\n          "}</>
                  )}
                </h1>
                {"\n\n          "}
                <p
                  id="detalle-descripcion"
                  {...props["detalle-descripcion"]}
                  className={combinarClases(estilos.descripcion, props["detalle-descripcion"]?.className ?? "lead mt-3")}
                >
                  {content["detalle-descripcion"] ?? (
                    <>{"\n            Cargando descripción...\n          "}</>
                  )}
                </p>
                {"\n\n          "}
                <p className="fs-3 fw-bold mt-4">
                  {"\n            "}
                  <span id="detalle-precio" {...props["detalle-precio"]} className={estilos.precio}>
                    {content["detalle-precio"] ?? <>{"—"}</>}
                  </span>
                  {"\n          "}
                </p>
                {"\n\n          "}
                <div className="mb-4">
                  {"\n            "}
                  <label
                    htmlFor="detalle-cantidad"
                    className="form-label fw-semibold"
                  >
                    {"\n              Cantidad\n            "}
                  </label>
                  {"\n\n            "}
                  <input
                    type="number"
                    id="detalle-cantidad"
                    min="1"
                    defaultValue="1"
                    {...props["detalle-cantidad"]}
                    className={combinarClases(estilos.cantidad, props["detalle-cantidad"]?.className ?? "form-control")}
                  />
                  {"\n          "}
                </div>
                {"\n\n          "}
                <div className="d-flex flex-wrap gap-3">
                  {"\n            "}
                  <button
                    type="button"
                    id="btn-agregar-detalle"
                    className="btn btn-outline-success"
                    disabled={true}
                    {...props["btn-agregar-detalle"]}
                  >
                    {content["btn-agregar-detalle"] ?? (
                      <>{"\n              Agregar al carrito\n            "}</>
                    )}
                  </button>
                  {"\n\n            "}
                  <button
                    type="button"
                    id="btn-volver-catalogo"
                    className="btn btn-outline-secondary"
                    {...props["btn-volver-catalogo"]}
                  >
                    {content["btn-volver-catalogo"] ?? (
                      <>{"\n              Volver al catálogo\n            "}</>
                    )}
                  </button>
                  {"\n          "}
                </div>
                {"\n\n          "}
                <Notificacion
                  id="mensaje-carrito"
                  role="status"
                  aria-live="polite"
                  {...props["mensaje-carrito"]}
                  className={combinarClases(estilos.mensajeCarrito, props["mensaje-carrito"]?.className ?? "alert alert-success d-none mt-4")}
                >
                  {content["mensaje-carrito"] ?? <></>}
                </Notificacion>
                {"\n        "}
              </div>
              {"\n      "}
            </>
          )}
        </section>
        {"\n    "}
      </main>
      {"\n\n    "}
      <Footer />
      {"\n\n    "}
      {"\n    "}
      {"\n  "}
    </>
  );
}
