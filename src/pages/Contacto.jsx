import { Navbar, Footer } from "../components/Layout.jsx";

// Estructura y textos de la pantalla original, conservados en JSX.
export default function Contacto({ props = {}, content = {} }) {
  return (
    <>
      {"\n    "}
      <Navbar />
      {"\n\n    "}
      <main className="contenedor-registro">
        {"\n      "}
        <div className="tarjeta-registro">
          {"\n        "}
          <h2 className="titulo-registro">{"Contacto"}</h2>
          {"\n        "}
          <p className="text-center text-muted mb-4">
            {"Pastelería 1000 Sabores"}
          </p>
          {"\n        "}
          <div
            id="mensaje-contacto"
            className="alert d-none"
            role="alert"
            {...props["mensaje-contacto"]}
          >
            {content["mensaje-contacto"] ?? <></>}
          </div>
          {"\n\n        "}
          <form id="form-contacto" {...props["form-contacto"]}>
            {content["form-contacto"] ?? (
              <>
                {"\n          "}
                <div className="campo-grupo">
                  {"\n            "}
                  <label htmlFor="correo-contacto" className="form-label">
                    {"Dirección Mail"}
                  </label>
                  {"\n            "}
                  <input
                    type="email"
                    className="form-control"
                    id="correo-contacto"
                    name="correo"
                    placeholder="name@example.com"
                    required={true}
                    {...props["correo-contacto"]}
                  />
                  {"\n          "}
                </div>
                {"\n\n          "}
                <div className="campo-grupo">
                  {"\n            "}
                  <label htmlFor="consulta-contacto" className="form-label">
                    {"Ingrese su consulta"}
                  </label>
                  {"\n            "}
                  <textarea
                    className="form-control"
                    id="consulta-contacto"
                    name="mensaje"
                    rows="6"
                    placeholder="Escriba su consulta aquí..."
                    required={true}
                    {...props["consulta-contacto"]}
                  />
                  {"\n          "}
                </div>
                {"\n\n          "}
                <div className="d-grid gap-2 mt-4">
                  {"\n            "}
                  <button type="submit" className="btn btn-registrar btn-zoom">
                    {"\n              Enviar consulta\n            "}
                  </button>
                  {"\n          "}
                </div>
                {"\n        "}
              </>
            )}
          </form>
          {"\n      "}
        </div>
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
