import { Navbar } from "../components/layout/Navbar.jsx";
import { Footer } from "../components/layout/Footer.jsx";

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
          className="row g-4 align-items-center"
          aria-labelledby="detalle-titulo"
          {...props["detalle-producto"]}
        >
          {content["detalle-producto"] ?? (
            <>
              {"\n        "}
              <div className="col-12 col-lg-6">
                {"\n          "}
                <img
                  id="detalle-imagen"
                  className="img-fluid rounded shadow-sm"
                  alt=""
                  {...props["detalle-imagen"]}
                />
                {"\n        "}
              </div>
              {"\n\n        "}
              <div className="col-12 col-lg-6">
                {"\n          "}
                <p
                  id="detalle-categoria"
                  className="text-uppercase text-muted mb-2"
                  {...props["detalle-categoria"]}
                >
                  {content["detalle-categoria"] ?? (
                    <>{"\n            Categoría por cargar\n          "}</>
                  )}
                </p>
                {"\n\n          "}
                <h1 id="detalle-titulo" {...props["detalle-titulo"]}>
                  {content["detalle-titulo"] ?? (
                    <>{"\n            Cargando producto...\n          "}</>
                  )}
                </h1>
                {"\n\n          "}
                <p
                  id="detalle-descripcion"
                  className="lead mt-3"
                  {...props["detalle-descripcion"]}
                >
                  {content["detalle-descripcion"] ?? (
                    <>{"\n            Cargando descripción...\n          "}</>
                  )}
                </p>
                {"\n\n          "}
                <p className="fs-3 fw-bold mt-4">
                  {"\n            "}
                  <span id="detalle-precio" {...props["detalle-precio"]}>
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
                    className="form-control"
                    min="1"
                    defaultValue="1"
                    {...props["detalle-cantidad"]}
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
                <div
                  id="mensaje-carrito"
                  className="alert alert-success d-none mt-4"
                  role="status"
                  aria-live="polite"
                  {...props["mensaje-carrito"]}
                >
                  {content["mensaje-carrito"] ?? <></>}
                </div>
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
