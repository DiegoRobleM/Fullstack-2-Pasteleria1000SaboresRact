import { combinarClases } from "../../utils/combinarClases.js";
import estilos from "./contacto.module.css";
import { Navbar } from "../../components/layout/Navbar.jsx";
import { Footer } from "../../components/layout/Footer.jsx";

// Estructura y textos de la pantalla original, conservados en JSX.
export default function Contacto({ props = {}, content = {} }) {
  return (
    <>
      {"\n    "}
      <Navbar />
      {"\n\n    "}
      <main className={combinarClases("contenedorFormulario", estilos.pagina)}>
        {"\n      "}
        <div className="tarjetaFormulario">
          {"\n        "}
          <h2 className="tituloFormulario">{"Contacto"}</h2>
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
                <div className="grupoCampo">
                  {"\n            "}
                  <label htmlFor="correo-contacto" className="form-label etiquetaFormulario">
                    {"Dirección Mail"}
                  </label>
                  {"\n            "}
                  <input
                    type="email"
                    id="correo-contacto"
                    name="correo"
                    placeholder="name@example.com"
                    required={true}
                    {...props["correo-contacto"]}
                    className={combinarClases("form-control controlFormulario", props["correo-contacto"]?.className ?? "")}
                  />
                  {"\n          "}
                </div>
                {"\n\n          "}
                <div className="grupoCampo">
                  {"\n            "}
                  <label htmlFor="consulta-contacto" className="form-label etiquetaFormulario">
                    {"Ingrese su consulta"}
                  </label>
                  {"\n            "}
                  <textarea
                    id="consulta-contacto"
                    name="mensaje"
                    rows="6"
                    placeholder="Escriba su consulta aquí..."
                    required={true}
                    {...props["consulta-contacto"]}
                    className={combinarClases("form-control controlFormulario", props["consulta-contacto"]?.className ?? "")}
                  />
                  {"\n          "}
                </div>
                {"\n\n          "}
                <div className="d-grid gap-2 mt-4">
                  {"\n            "}
                  <button type="submit" className={combinarClases("btn botonPasteleria", "btn-zoom")}>
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
