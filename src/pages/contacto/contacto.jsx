import { useEffect, useState } from "react";
import estilos from "./contacto.module.css";
import { BarraNavegacion } from "../../components/estructura/barraNavegacion.jsx";
import { PiePagina } from "../../components/estructura/piePagina.jsx";
import { paginas } from "../../app/pages.js";
import { registrarConsulta } from "../../services/consultas.js";

export default function Contacto() {
  const [mensaje, establecerMensaje] = useState(null);

  useEffect(() => {
    document.title = paginas.Contacto.title;
  }, []);

  function enviarConsulta(evento) {
    evento.preventDefault();
    const formulario = evento.currentTarget;
    const resultado = registrarConsulta(new FormData(formulario));

    establecerMensaje(resultado);
    if (resultado.tipo === "success") formulario.reset();
  }

  return (
    <>
      <BarraNavegacion />

      <main className={estilos.pagina}>
        <div className={estilos.tarjetaFormulario}>
          {/* Encabezado con Ícono Animado de Café */}
          <div className={estilos.encabezado}>
            <div className={estilos.iconoCafeWrapper}>
              <svg
                className={estilos.iconoCafe}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
                <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
                <line x1="6" y1="2" x2="6" y2="5" className={estilos.humo1}></line>
                <line x1="10" y1="1" x2="10" y2="4" className={estilos.humo2}></line>
                <line x1="14" y1="2" x2="14" y2="5" className={estilos.humo3}></line>
              </svg>
            </div>
            <h2 className={estilos.tituloFormulario}>Contacto</h2>
            <p className={estilos.subtituloFormulario}>Pastelería 1000 Sabores</p>
          </div>

          {/* Mensaje de alerta de envío */}
          {mensaje && (
            <div
              id="mensaje-contacto"
              className={`${estilos.alerta} ${
                mensaje.tipo === "success" ? estilos.alertaExito : estilos.alertaError
              }`}
              role="alert"
            >
              {mensaje.texto}
            </div>
          )}

          <form id="form-contacto" onSubmit={enviarConsulta}>
            {/* Fila en 2 columnas: Email y Nombre (Según imagen de referencia) */}
            <div className={estilos.filaCampos}>
              {/* Campo Email */}
              <div className={estilos.grupoCampo}>
                <label htmlFor="correo-contacto" className={estilos.etiquetaFormulario}>
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
                  Dirección Mail
                </label>
                <input
                  type="email"
                  id="correo-contacto"
                  name="correo"
                  placeholder="name@example.com"
                  required
                  className={estilos.controlFormulario}
                />
              </div>

              {/* Campo Nombre */}
              <div className={estilos.grupoCampo}>
                <label htmlFor="nombre-contacto" className={estilos.etiquetaFormulario}>
                  <svg
                    className={estilos.iconoInput}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  Nombre
                </label>
                <input
                  type="text"
                  id="nombre-contacto"
                  name="nombre"
                  placeholder="Ingrese su nombre"
                  required
                  className={estilos.controlFormulario}
                />
              </div>
            </div>

            {/* Campo Consulta */}
            <div className={estilos.grupoCampo}>
              <label htmlFor="consulta-contacto" className={estilos.etiquetaFormulario}>
                <svg
                  className={estilos.iconoInput}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                Ingrese su consulta
              </label>
              <textarea
                id="consulta-contacto"
                name="mensaje"
                rows="5"
                placeholder="Escriba su consulta aquí..."
                required
                className={estilos.controlFormulario}
              />
            </div>

            {/* Botón de envío */}
            <div className={estilos.contenedorBoton}>
              <button type="submit" className={estilos.botonEnviar}>
                <span>Enviar consulta</span>
                <svg
                  className={estilos.iconoBoton}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      </main>

      <PiePagina />
    </>
  );
}