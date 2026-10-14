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
import estilos from "./inicioSesion.module.css";

export default function InicioSesion() {
  const [mensaje, establecerMensaje] = useState(null);
  const navegar = useNavigate();
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

    establecerMensaje(resultado);
    if (resultado.limpiarContrasena) formulario.elements.password.value = "";
    if (resultado.enfocar)
      formulario.querySelector("#" + resultado.enfocar)?.focus();
    if (resultado.tipo === "success") refrescarUsuario();
    if (resultado.redirigir) {
      temporizador.current = setTimeout(
        () => navegar(resultado.redirigir),
        resultado.demora
      );
    }
  }

  return (
    <>
      <BarraNavegacion />

      <main className={estilos.pagina}>
        <div className={estilos.tarjetaFormulario}>
          {/* Encabezado con ícono badge */}
          <div className={estilos.encabezado}>
            <div className={estilos.iconoBadgeWrapper}>
              <svg
                className={estilos.iconoBadge}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <h1 className={estilos.tituloFormulario}>{"Iniciar Sesión"}</h1>
            <p className={estilos.subtituloFormulario}>
              {"Pastelería 1000 Sabores"}
            </p>
          </div>

          {/* Mensaje de alerta de login */}
          {mensaje && (
            <div
              id="mensaje-login"
              className={`${estilos.alerta} ${
                mensaje.tipo === "success"
                  ? estilos.alertaExito
                  : estilos.alertaError
              }`}
              role="alert"
            >
              {mensaje.texto}
            </div>
          )}

          <form id="form-inicio-sesion" onSubmit={iniciarSesion}>
            {/* Campo Correo Electrónico */}
            <div className={estilos.grupoCampo}>
              <label
                htmlFor="inputEmail"
                className={estilos.etiquetaFormulario}
              >
                <svg
                  className={estilos.iconoInput}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                {"Correo electrónico"}
              </label>
              <input
                type="email"
                id="inputEmail"
                name="email"
                autoComplete="email"
                placeholder="ejemplo@correo.com"
                required={true}
                className={estilos.controlFormulario}
              />
            </div>

            {/* Campo Contraseña */}
            <div className={estilos.grupoCampo}>
              <label
                htmlFor="inputPassword"
                className={estilos.etiquetaFormulario}
              >
                <svg
                  className={estilos.iconoInput}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                {"Contraseña"}
              </label>
              <input
                type="password"
                id="inputPassword"
                name="password"
                autoComplete="current-password"
                placeholder="••••••••"
                required={true}
                className={estilos.controlFormulario}
              />
            </div>

            {/* Checkbox Recordar Cuenta */}
            <div className={estilos.grupoCheckbox}>
              <label className={estilos.etiquetaCheckbox} htmlFor="gridCheck">
                <input
                  type="checkbox"
                  id="gridCheck"
                  name="recordarCuenta"
                  className={estilos.inputCheckbox}
                />
                <span>{"Recordar mi cuenta"}</span>
              </label>
            </div>

            {/* Botón de envío y enlace a Registro */}
            <div className={estilos.contenedorBoton}>
              <button type="submit" className={estilos.botonEnviar}>
                <span>{"Iniciar Sesión"}</span>
                <svg
                  className={estilos.iconoBoton}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>

              <Link to="/registro" className={estilos.linkRegistro}>
                {"¿No tienes cuenta? Regístrate aquí"}
              </Link>
            </div>
          </form>
        </div>
      </main>

      <PiePagina />
    </>
  );
}