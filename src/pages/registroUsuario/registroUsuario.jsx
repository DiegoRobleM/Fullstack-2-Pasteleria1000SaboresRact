import { useEffect, useRef, useState } from "react";
import { registrarUsuario as registrarCuenta } from "../../services/autenticacion.js";
import { paginas } from "../../app/pages.js";
import { Link, useNavigate } from "react-router-dom";
import AlertaFormulario from "../../components/alerta/alertaFormulario.jsx";
import estilos from "./registroUsuario.module.css";
import { BarraNavegacion } from "../../components/estructura/barraNavegacion.jsx";
import { PiePagina } from "../../components/estructura/piePagina.jsx";

export default function RegistroUsuario() {
  const [mensaje, establecerMensaje] = useState(null);
  const navegar = useNavigate();
  const temporizador = useRef(null);
  const mensajeElemento = useRef(null);

  useEffect(() => {
    document.title = paginas.RegistroUsuario.title;
    return () => clearTimeout(temporizador.current);
  }, []);

  useEffect(() => {
    if (mensaje)
      mensajeElemento.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
  }, [mensaje]);

  function registrarUsuario(evento) {
    evento.preventDefault();
    clearTimeout(temporizador.current);
    const formulario = evento.currentTarget;
    const resultado = registrarCuenta(new FormData(formulario));

    establecerMensaje(resultado);
    if (resultado.enfocar)
      formulario.querySelector("#" + resultado.enfocar)?.focus();
    if (resultado.tipo === "success") formulario.reset();
    if (resultado.redirigir) {
      temporizador.current = setTimeout(
        () => navegar(resultado.redirigir),
        resultado.demora,
      );
    }
  }

  return (
    <>
      <BarraNavegacion />

      <main className={estilos.pagina}>
        {/* BANNER HERO REGISTRO */}
        <section className={estilos.heroRegistro}>
          <div className={estilos.heroContenido}>
            <span className={estilos.subtituloBadge}>
              {"Comunidad Pastelería"}
            </span>
            <h1 className={estilos.tituloHero}>{"Registro de Usuario"}</h1>
            <p className={estilos.bajadaHero}>
              {
                "Crea tu cuenta para guardar tus direcciones, acumular historial y agilizar tus compras."
              }
            </p>
          </div>
        </section>

        <div className="container py-5">
          <div className={estilos.contenedorFormulario}>
            <div className={estilos.tarjetaFormulario}>
              <h2 className={estilos.tituloFormulario}>
                {"Completa tus Datos"}
              </h2>

              {/* MENSAJE DE ALERTA DINÁMICO */}
              <AlertaFormulario
                id="mensaje-registro"
                role="alert"
                ref={mensajeElemento}
                className={estilos.mensajeRegistro}
                mensaje={mensaje}
              />

              <form id="form-registro" onSubmit={registrarUsuario}>
                {/* 1. NOMBRE Y APELLIDO */}
                <div className={estilos.grupoCampo}>
                  <div className="row g-3">
                    <div className="col-12 col-md-6">
                      <label
                        htmlFor="nombre"
                        className={estilos.etiquetaFormulario}
                      >
                        {"1. Nombre"}
                      </label>
                      <input
                        type="text"
                        id="nombre"
                        name="nombre"
                        autoComplete="given-name"
                        placeholder="Nombre"
                        className={estilos.controlFormulario}
                      />
                    </div>

                    <div className="col-12 col-md-6">
                      <label
                        htmlFor="apellido"
                        className={estilos.etiquetaFormulario}
                      >
                        {"Apellido"}
                      </label>
                      <input
                        type="text"
                        id="apellido"
                        name="apellido"
                        autoComplete="family-name"
                        placeholder="Apellido"
                        className={estilos.controlFormulario}
                      />
                    </div>
                  </div>
                </div>

                {/* 2. CORREO ELECTRÓNICO */}
                <div className={estilos.grupoCampo}>
                  <label
                    htmlFor="inputEmail"
                    className={estilos.etiquetaFormulario}
                  >
                    {"2. Correo electrónico"}
                  </label>
                  <input
                    type="email"
                    id="inputEmail"
                    name="email"
                    autoComplete="email"
                    placeholder="Escribe aquí tu correo"
                    className={estilos.controlFormulario}
                  />
                </div>

                {/* 3. CONTRASEÑA */}
                <div className={estilos.grupoCampo}>
                  <label
                    htmlFor="inputPassword"
                    className={estilos.etiquetaFormulario}
                  >
                    {"3. Contraseña"}
                  </label>
                  <input
                    type="password"
                    id="inputPassword"
                    name="password"
                    autoComplete="new-password"
                    placeholder="Mínimo 8 caracteres"
                    className={estilos.controlFormulario}
                  />
                </div>

                {/* 4. DIRECCIÓN DE ENVÍO */}
                <div className={estilos.grupoCampo}>
                  <label
                    htmlFor="inputAddress"
                    className={estilos.etiquetaFormulario}
                  >
                    {"4. Dirección de envío"}
                  </label>
                  <input
                    type="text"
                    id="inputAddress"
                    name="direccion"
                    autoComplete="street-address"
                    placeholder="Escribe aquí tu dirección"
                    className={`${estilos.controlFormulario} mb-2`}
                  />

                  <label
                    htmlFor="inputAddress2"
                    className={estilos.etiquetaFormularioSecundaria}
                  >
                    {"Tipo de propiedad (opcional)"}
                  </label>
                  <input
                    type="text"
                    id="inputAddress2"
                    name="tipoPropiedad"
                    placeholder="Departamento, casa, etc."
                    className={estilos.controlFormulario}
                  />
                </div>

                {/* 5. REGIÓN Y COMUNA */}
                <div className={estilos.grupoCampo}>
                  <div className="row g-3">
                    <div className="col-12 col-md-6">
                      <label
                        htmlFor="inputState"
                        className={estilos.etiquetaFormulario}
                      >
                        {"5. Región"}
                      </label>
                      <select
                        id="inputState"
                        defaultValue=""
                        name="region"
                        className={estilos.controlFormularioSelect}
                      >
                        <option value="" disabled={true}>
                          {"Seleccione una región"}
                        </option>
                        <option value="antofagasta">{"Antofagasta"}</option>
                        <option value="arica-y-parinacota">
                          {"Arica y Parinacota"}
                        </option>
                        <option value="atacama">{"Atacama"}</option>
                        <option value="aysen">
                          {"Aysén del General Carlos Ibáñez del Campo"}
                        </option>
                        <option value="biobio">{"Biobío"}</option>
                        <option value="coquimbo">{"Coquimbo"}</option>
                        <option value="la-araucania">{"La Araucanía"}</option>
                        <option value="o-higgins">
                          {"Libertador General Bernardo O'Higgins"}
                        </option>
                        <option value="los-lagos">{"Los Lagos"}</option>
                        <option value="los-rios">{"Los Ríos"}</option>
                        <option value="magallanes">
                          {"Magallanes y de la Antártica Chilena"}
                        </option>
                        <option value="maule">{"Maule"}</option>
                        <option value="nuble">{"Ñuble"}</option>
                        <option value="metropolitana">
                          {"Región Metropolitana de Santiago"}
                        </option>
                        <option value="tarapaca">{"Tarapacá"}</option>
                        <option value="valparaiso">{"Valparaíso"}</option>
                      </select>
                    </div>

                    <div className="col-12 col-md-6">
                      <label
                        htmlFor="inputComuna"
                        className={estilos.etiquetaFormulario}
                      >
                        {"Comuna"}
                      </label>
                      <input
                        type="text"
                        id="inputComuna"
                        name="comuna"
                        autoComplete="address-level2"
                        placeholder="Comuna"
                        className={estilos.controlFormulario}
                      />
                    </div>
                  </div>
                </div>

                {/* CHECKBOX DATO */}
                <div className={`${estilos.grupoCampo} mt-3`}>
                  <div className={estilos.contenedorCheckbox}>
                    <input
                      className={estilos.checkboxInput}
                      type="checkbox"
                      id="gridCheck"
                      name="guardarDatos"
                      defaultValue="true"
                    />
                    <label
                      className={estilos.checkboxLabel}
                      htmlFor="gridCheck"
                    >
                      {"Guardar mis datos para futuras compras"}
                    </label>
                  </div>
                </div>

                {/* BOTÓN SUBMIT Y ENLACE LOGIN */}
                <div className="d-grid gap-2 mt-4">
                  <button type="submit" className={estilos.btnRegistrarse}>
                    {"Registrarse"}
                  </button>

                  <Link
                    to="/inicio-sesion"
                    className={estilos.enlaceInicioSesion}
                  >
                    {"¿Ya tienes cuenta? Inicia Sesión aquí"}
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>

      <PiePagina />
    </>
  );
}
