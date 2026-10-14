import { Fragment, useEffect, useRef, useState } from "react";
import { registrarUsuario as registrarCuenta } from "../../services/autenticacion.js";
import { paginas } from "../../app/pages.js";
import { Link, useNavigate } from "react-router-dom";
import { combinarClases } from "../../utils/combinarClases.js";
import estilos from "./registroUsuario.module.css";
import { BarraNavegacion } from "../../components/estructura/barraNavegacion.jsx";
import { PiePagina } from "../../components/estructura/piePagina.jsx";

// Estructura y textos de la pantalla original, conservados en JSX.
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
      {"\n    "}
      <BarraNavegacion />
      {"\n    "}
      <main className="contenedorFormulario">
        {"\n      "}
        <div className="tarjetaFormulario">
          {"\n        "}
          <h2 className="tituloFormulario">{"Registro de Usuario"}</h2>
          {"\n        "}
          <div
            id="mensaje-registro"
            role="alert"
            ref={mensajeElemento}
            className={combinarClases(
              estilos.mensajeRegistro,
              mensaje ? "alert alert-" + mensaje.tipo : "alert d-none",
            )}
          >
            {Array.isArray(mensaje?.texto)
              ? mensaje.texto.map((texto, indice) => (
                  <Fragment key={texto}>
                    {indice > 0 && <br />}
                    {texto}
                  </Fragment>
                ))
              : mensaje?.texto}
          </div>
          {"\n        "}
          <form id="form-registro" onSubmit={registrarUsuario}>
            {"\n          "}
            <div className="grupoCampo">
              {"\n            "}
              <div className="row g-2">
                {"\n              "}
                <div className="col-12 col-md-6">
                  {"\n                "}
                  <label
                    htmlFor="nombre"
                    className="form-label etiquetaFormulario"
                  >
                    {"1. Nombre"}
                  </label>
                  {"\n                "}
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    autoComplete="given-name"
                    placeholder="Nombre"
                    className="form-control controlFormulario"
                  />
                  {"\n              "}
                </div>
                {"\n              "}
                <div className="col-12 col-md-6">
                  {"\n                "}
                  <label
                    htmlFor="apellido"
                    className="form-label etiquetaFormulario"
                  >
                    {"Apellido"}
                  </label>
                  {"\n                "}
                  <input
                    type="text"
                    id="apellido"
                    name="apellido"
                    autoComplete="family-name"
                    placeholder="Apellido"
                    className="form-control controlFormulario"
                  />
                  {"\n              "}
                </div>
                {"\n            "}
              </div>
              {"\n          "}
            </div>
            {"\n          "}
            <div className="grupoCampo">
              {"\n            "}
              <label htmlFor="inputEmail" className="f-label">
                {"2. Correo electrónico"}
              </label>
              {"\n            "}
              <input
                type="email"
                id="inputEmail"
                name="email"
                autoComplete="email"
                placeholder="Escribe aquí tu correo"
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
                {"3. Contraseña"}
              </label>
              {"\n            "}
              <input
                type="password"
                id="inputPassword"
                name="password"
                autoComplete="new-password"
                placeholder="Mínimo 8 caracteres"
                className="form-control controlFormulario"
              />
              {"\n          "}
            </div>
            {"\n          "}
            <div className="grupoCampo">
              {"\n            "}
              <label
                htmlFor="inputAddress"
                className="form-label etiquetaFormulario"
              >
                {"4. Dirección de envío"}
              </label>
              {"\n            "}
              <input
                type="text"
                id="inputAddress"
                name="direccion"
                autoComplete="street-address"
                placeholder="Escribe aquí tu dirección"
                className="form-control controlFormulario mb-2"
              />
              {"\n            "}
              <label
                htmlFor="inputAddress2"
                className="form-label etiquetaFormulario"
              >
                {"Tipo de propiedad (opcional)"}
              </label>
              {"\n            "}
              <input
                type="text"
                id="inputAddress2"
                name="tipoPropiedad"
                placeholder="Departamento, casa, etc."
                className="form-control controlFormulario"
              />
              {"\n          "}
            </div>
            {"\n          "}
            <div className="grupoCampo">
              {"\n            "}
              <div className="row g-2">
                {"\n              "}
                <div className="col-12 col-md-6">
                  {"\n                "}
                  <label
                    htmlFor="inputState"
                    className="form-label etiquetaFormulario"
                  >
                    {"5. Región"}
                  </label>
                  {"\n                "}
                  <select
                    id="inputState"
                    defaultValue=""
                    name="region"
                    className="form-select controlFormulario"
                  >
                    {"\n                  "}
                    <option value="" disabled={true}>
                      {"Seleccione una región"}
                    </option>
                    {"\n                  "}
                    <option value="antofagasta">{"Antofagasta"}</option>
                    {"\n                  "}
                    <option value="arica-y-parinacota">
                      {"Arica y Parinacota"}
                    </option>
                    {"\n                  "}
                    <option value="atacama">{"Atacama"}</option>
                    {"\n                  "}
                    <option value="aysen">
                      {"Aysén del General Carlos Ibáñez del Campo"}
                    </option>
                    {"\n                  "}
                    <option value="biobio">{"Biobío"}</option>
                    {"\n                  "}
                    <option value="coquimbo">{"Coquimbo"}</option>
                    {"\n                  "}
                    <option value="la-araucania">{"La Araucanía"}</option>
                    {"\n                  "}
                    <option value="o-higgins">
                      {"Libertador General Bernardo O'Higgins"}
                    </option>
                    {"\n                  "}
                    <option value="los-lagos">{"Los Lagos"}</option>
                    {"\n                  "}
                    <option value="los-rios">{"Los Ríos"}</option>
                    {"\n                  "}
                    <option value="magallanes">
                      {"Magallanes y de la Antártica Chilena"}
                    </option>
                    {"\n                  "}
                    <option value="maule">{"Maule"}</option>
                    {"\n                  "}
                    <option value="nuble">{"Ñuble"}</option>
                    {"\n                  "}
                    <option value="metropolitana">
                      {"Región Metropolitana de Santiago"}
                    </option>
                    {"\n                  "}
                    <option value="tarapaca">{"Tarapacá"}</option>
                    {"\n                  "}
                    <option value="valparaiso">{"Valparaíso"}</option>
                    {"\n                "}
                  </select>
                  {"\n              "}
                </div>
                {"\n              "}
                <div className="col-12 col-md-6">
                  {"\n                "}
                  <label
                    htmlFor="inputComuna"
                    className="form-label etiquetaFormulario"
                  >
                    {"Comuna"}
                  </label>
                  {"\n                "}
                  <input
                    type="text"
                    id="inputComuna"
                    name="comuna"
                    autoComplete="address-level2"
                    placeholder="Comuna"
                    className="form-control controlFormulario"
                  />
                  {"\n              "}
                </div>
                {"\n            "}
              </div>
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
                  name="guardarDatos"
                  defaultValue="true"
                />
                {"\n              "}
                <label className="form-check-label" htmlFor="gridCheck">
                  {"Guardar mis datos para futuras compras"}
                </label>
                {"\n            "}
              </div>
              {"\n          "}
            </div>
            {"\n          "}
            <div className="d-grid gap-2 mt-4">
              {"\n            "}
              <button type="submit" className="btn botonPasteleria btn-zoom">
                {"Registrarse"}
              </button>
              {"\n            "}
              <Link
                to="/inicio-sesion"
                className="text-center text-decoration-none mt-2 text-muted small"
              >
                {"¿Ya tienes cuenta? Inicia Sesión aquí"}
              </Link>
              {"\n          "}
            </div>
            {"\n        "}
          </form>
          {"\n      "}
        </div>
        {"\n    "}
      </main>
      {"\n    "}
      <PiePagina />
      {"\n    "}
      {"\n    "}
      {"\n  "}
    </>
  );
}
