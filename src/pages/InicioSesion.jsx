import { Navbar, Footer } from "../components/Layout.jsx";

// Estructura y textos de la pantalla original, conservados en JSX.
export default function InicioSesion({ props = {}, content = {} }) {
  return (
    <>
      {"\n    "}
      <Navbar />
      {"\n\n    "}
      <main className="contenedor-registro">
        {"\n      "}
        <div className="tarjeta-registro">
          {"\n        "}
          <h2 className="titulo-registro">{"Iniciar Sesión"}</h2>
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
                <div className="campo-grupo">
                  {"\n            "}
                  <label htmlFor="inputEmail" className="form-label">
                    {"Correo electrónico"}
                  </label>
                  {"\n            "}
                  <input
                    type="email"
                    className="form-control"
                    id="inputEmail"
                    name="email"
                    autoComplete="email"
                    placeholder="Ingrese su correo electrónico"
                    required={true}
                    {...props["inputEmail"]}
                  />
                  {"\n          "}
                </div>
                {"\n          "}
                <div className="campo-grupo">
                  {"\n            "}
                  <label htmlFor="inputPassword" className="form-label">
                    {"Contraseña"}
                  </label>
                  {"\n            "}
                  <input
                    type="password"
                    className="form-control"
                    id="inputPassword"
                    name="password"
                    autoComplete="current-password"
                    placeholder="Ingrese su contraseña"
                    required={true}
                    {...props["inputPassword"]}
                  />
                  {"\n          "}
                </div>
                {"\n          "}
                <div className="campo-grupo mt-3">
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
                  <button type="submit" className="btn btn-registrar btn-zoom">
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
