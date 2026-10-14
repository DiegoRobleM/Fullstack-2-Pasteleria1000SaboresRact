import { useEffect, useRef, useState } from "react";
import {
  crearAdministradorDemo,
  iniciarSesion as validarInicioSesion,
} from "../../services/autenticacion.js";
import { useTienda } from "../../context/ContextoTienda.jsx";
import { paginas } from "../../app/pages.js";
import { Link, useNavigate } from "react-router-dom";
import { BarraNavegacion } from "../../components/estructura/barraNavegacion.jsx";
import { PiePagina } from "../../components/estructura/piePagina.jsx";

// Estructura y textos de la pantalla original, conservados en JSX.
export default function InicioSesion() {
  const [mensaje, setMensaje] = useState(null);
  const navigate = useNavigate();
  const temporizador = useRef(null);
  const { refrescarUsuario } = useTienda();

  useEffect(() => {
    document.title = paginas.InicioSesion.title;
    crearAdministradorDemo();
    return () => clearTimeout(temporizador.current);
  }, []);

  function iniciarSesion(evento) {
    evento.preventDefault();
    clearTimeout(temporizador.current);
    const formulario = evento.currentTarget;
    const resultado = validarInicioSesion(new FormData(formulario));

    setMensaje(resultado);
    if (resultado.limpiarContrasena) formulario.elements.password.value = "";
    if (resultado.enfocar)
      formulario.querySelector("#" + resultado.enfocar)?.focus();
    if (resultado.tipo === "success") refrescarUsuario();
    if (resultado.redirigir) {
      temporizador.current = setTimeout(
        () => navigate(resultado.redirigir),
        resultado.demora,
      );
    }
  }

  return (
    <>
      {"\n    "}
      <BarraNavegacion />
      {"\n\n    "}
      <main className="contenedorFormulario">
        {"\n      "}
        <div className="tarjetaFormulario">
          {"\n        "}
          <h2 className="tituloFormulario">{"Iniciar Sesión"}</h2>
          {"\n        "}
          <div
            id="mensaje-login"
            className={mensaje ? "alert alert-" + mensaje.tipo : "alert d-none"}
            role="alert"
          >
            {mensaje?.texto}
          </div>
          {"\n\n        "}
          <form id="form-inicio-sesion" onSubmit={iniciarSesion}>
            {"\n          "}
            <div className="grupoCampo">
              {"\n            "}
              <label
                htmlFor="inputEmail"
                className="form-label etiquetaFormulario"
              >
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
                className="form-control controlFormulario"
              />
              {"\n          "}
            </div>
            {"\n          "}
            <div className="grupoCampo">
              {"\n            "}
              <label
                htmlFor="inputPassword"
                className="form-label etiquetaFormulario"
              >
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
                className="form-control controlFormulario"
              />
              {"\n          "}
            </div>
            {"\n          "}
            <div className="grupoCampo mt-3">
              {"\n            "}
              <div className="form-check">
                {"\n              "}
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="gridCheck"
                  name="recordarCuenta"
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
              <button type="submit" className="btn botonPasteleria btn-zoom">
                {"\n              Iniciar Sesión\n            "}
              </button>
              {"\n            "}
              <Link
                to="/registro"
                className="text-center text-decoration-none mt-2 text-muted small"
              >
                {
                  "\n              ¿No tienes cuenta? Regístrate aquí\n            "
                }
              </Link>
              {"\n          "}
            </div>
            {"\n        "}
          </form>
          {"\n      "}
        </div>
        {"\n    "}
      </main>
      {"\n\n    "}
      <PiePagina />
      {"\n    "}
      {"\n    "}
      {"\n  "}
    </>
  );
}
