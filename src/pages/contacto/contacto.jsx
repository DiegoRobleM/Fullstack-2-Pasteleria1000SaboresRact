import { useEffect, useState } from "react";
import estilos from "./contacto.module.css";
import { BarraNavegacion } from "../../components/estructura/barraNavegacion.jsx";
import { PiePagina } from "../../components/estructura/piePagina.jsx";
import { paginas } from "../../app/pages.js";
import { registrarConsulta } from "../../services/consultas.js";
import AlertaFormulario from "../../components/alerta/alertaFormulario.jsx";

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
      <main className={"contenedorFormulario " + estilos.pagina}>
        <div className="tarjetaFormulario">
          <h2 className="tituloFormulario">Contacto</h2>
          <p className="text-center text-muted mb-4">Pastelería 1000 Sabores</p>

          <AlertaFormulario
            id="mensaje-contacto"
            role="alert"
            mensaje={mensaje}
          />

          <form id="form-contacto" onSubmit={enviarConsulta}>
            <div className="grupoCampo">
              <label
                htmlFor="correo-contacto"
                className="form-label etiquetaFormulario"
              >
                Dirección Mail
              </label>
              <input
                type="email"
                id="correo-contacto"
                name="correo"
                placeholder="name@example.com"
                required
                className="form-control controlFormulario"
              />
            </div>

            <div className="grupoCampo">
              <label
                htmlFor="consulta-contacto"
                className="form-label etiquetaFormulario"
              >
                Ingrese su consulta
              </label>
              <textarea
                id="consulta-contacto"
                name="mensaje"
                rows="6"
                placeholder="Escriba su consulta aquí..."
                required
                className="form-control controlFormulario"
              />
            </div>

            <div className="d-grid gap-2 mt-4">
              <button type="submit" className="btn botonPasteleria btn-zoom">
                Enviar consulta
              </button>
            </div>
          </form>
        </div>
      </main>
      <PiePagina />
    </>
  );
}
