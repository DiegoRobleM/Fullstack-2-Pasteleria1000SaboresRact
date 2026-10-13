import { combinarClases } from "../../utils/combinarClases.js";
import { Navbar } from "../../components/layout/Navbar.jsx";
import { Footer } from "../../components/layout/Footer.jsx";

// Estructura y textos de la pantalla original, conservados en JSX.
export default function InicioSesion({ props = {}, content = {} }) {
  return (
    <>
      {"\n    "}
      <Navbar />
      {"\n\n    "}
      <main className="contenedorFormulario">
        {"\n      "}
        <div className="tarjetaFormulario">
          {"\n        "}
          <h2 className="tituloFormulario">{"Iniciar Sesión"}</h2>
          {"\n        "}
          <div
            id="mensaje-login"
            className="alert d-none"
            role="alert"
            {...props["mensaje-login"]}
          >
            {content["mensaje-login"] ?? <></>}
          </div>
          {"\n\n        "}
          <form id="form-inicio-sesion" {...props["form-inicio-sesion"]}>
            {content["form-inicio-sesion"] ?? (
              <>
                {"\n          "}
                <div className="grupoCampo">
                  {"\n            "}
                  <label htmlFor="inputEmail" className="form-label etiquetaFormulario">
                    {"Correo electrónico"}
                  </label>
                  {"\n            "}
                  <input
                    type="email"
                    id="inputEmail"
                    name="email"
                    autoComplete="email"
                    placeholder="Ingrese su correo electrónico"
                    required={true}
                    {...props["inputEmail"]}
                    className={combinarClases("form-control controlFormulario", props["inputEmail"]?.className ?? "")}
                  />
                  {"\n          "}
                </div>
                {"\n          "}
                <div className="grupoCampo">
                  {"\n            "}
                  <label htmlFor="inputPassword" className="form-label etiquetaFormulario">
                    {"Contraseña"}
                  </label>
                  {"\n            "}
                  <input
                    type="password"
                    id="inputPassword"
                    name="password"
                    autoComplete="current-password"
                    placeholder="Ingrese su contraseña"
                    required={true}
                    {...props["inputPassword"]}
                    className={combinarClases("form-control controlFormulario", props["inputPassword"]?.className ?? "")}
                  />
                  {"\n          "}
                </div>
                {"\n          "}
                <div className={combinarClases("grupoCampo mt-3")}>
                  {"\n            "}
                  <div className="form-check">
                    {"\n              "}
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="gridCheck"
                      name="recordarCuenta"
                      {...props["gridCheck"]}
                    />
                    {"\n              "}
                    <label className="form-check-label" htmlFor="gridCheck">
                      {"\n                Recordar mi cuenta\n              "}
                    </label>
                    {"\n            "}
                  </div>
                  {"\n          "}
                </div>
                {"\n          "}
                <div className="d-grid gap-2 mt-4">
                  {"\n            "}
                  <button type="submit" className={combinarClases("btn botonPasteleria", "btn-zoom")}>
                    {"\n              Iniciar Sesión\n            "}
                  </button>
                  {"\n            "}
                  <a
                    href="../RegistroUsuario/registro.html"
                    className="text-center text-decoration-none mt-2 text-muted small"
                  >
                    {
                      "\n              ¿No tienes cuenta? Regístrate aquí\n            "
                    }
                  </a>
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
      {"\n    "}
      {"\n    "}
      {"\n  "}
    </>
  );
}
