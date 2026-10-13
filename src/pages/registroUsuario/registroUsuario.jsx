import { combinarClases } from "../../utils/combinarClases.js";
import estilos from "./registroUsuario.module.css";
import { Navbar } from "../../components/layout/Navbar.jsx";
import { Footer } from "../../components/layout/Footer.jsx";

// Estructura y textos de la pantalla original, conservados en JSX.
export default function RegistroUsuario({ props = {}, content = {} }) {
  return (
    <>
      {"\n    "}
      <Navbar />
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
            {...props["mensaje-registro"]}
            className={combinarClases(estilos.mensajeRegistro, props["mensaje-registro"]?.className ?? "alert d-none")}
          >
            {content["mensaje-registro"] ?? <></>}
          </div>
          {"\n        "}
          <form id="form-registro" {...props["form-registro"]}>
            {content["form-registro"] ?? (
              <>
                {"\n          "}
                <div className="grupoCampo">
                  {"\n            "}
                  <div className="row g-2">
                    {"\n              "}
                    <div className="col-12 col-md-6">
                      {"\n                "}
                      <label htmlFor="nombre" className="form-label etiquetaFormulario">
                        {"1. Nombre"}
                      </label>
                      {"\n                "}
                      <input
                        type="text"
                        id="nombre"
                        name="nombre"
                        autoComplete="given-name"
                        placeholder="Nombre"
                        {...props["nombre"]}
                        className={combinarClases("form-control controlFormulario", props["nombre"]?.className ?? "")}
                      />
                      {"\n              "}
                    </div>
                    {"\n              "}
                    <div className="col-12 col-md-6">
                      {"\n                "}
                      <label htmlFor="apellido" className="form-label etiquetaFormulario">
                        {"Apellido"}
                      </label>
                      {"\n                "}
                      <input
                        type="text"
                        id="apellido"
                        name="apellido"
                        autoComplete="family-name"
                        placeholder="Apellido"
                        {...props["apellido"]}
                        className={combinarClases("form-control controlFormulario", props["apellido"]?.className ?? "")}
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
                    {...props["inputEmail"]}
                    className={combinarClases("form-control controlFormulario", props["inputEmail"]?.className ?? "")}
                  />
                  {"\n          "}
                </div>
                {"\n          "}
                <div className="grupoCampo">
                  {"\n            "}
                  <label htmlFor="inputPassword" className="form-label etiquetaFormulario">
                    {"3. Contraseña"}
                  </label>
                  {"\n            "}
                  <input
                    type="password"
                    id="inputPassword"
                    name="password"
                    autoComplete="new-password"
                    placeholder="Mínimo 8 caracteres"
                    {...props["inputPassword"]}
                    className={combinarClases("form-control controlFormulario", props["inputPassword"]?.className ?? "")}
                  />
                  {"\n          "}
                </div>
                {"\n          "}
                <div className="grupoCampo">
                  {"\n            "}
                  <label htmlFor="inputAddress" className="form-label etiquetaFormulario">
                    {"4. Dirección de envío"}
                  </label>
                  {"\n            "}
                  <input
                    type="text"
                    id="inputAddress"
                    name="direccion"
                    autoComplete="street-address"
                    placeholder="Escribe aquí tu dirección"
                    {...props["inputAddress"]}
                    className={combinarClases("form-control controlFormulario", props["inputAddress"]?.className ?? "mb-2")}
                  />
                  {"\n            "}
                  <label htmlFor="inputAddress2" className="form-label etiquetaFormulario">
                    {"Tipo de propiedad (opcional)"}
                  </label>
                  {"\n            "}
                  <input
                    type="text"
                    id="inputAddress2"
                    name="tipoPropiedad"
                    placeholder="Departamento, casa, etc."
                    {...props["inputAddress2"]}
                    className={combinarClases("form-control controlFormulario", props["inputAddress2"]?.className ?? "")}
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
                      <label htmlFor="inputState" className="form-label etiquetaFormulario">
                        {"5. Región"}
                      </label>
                      {"\n                "}
                      <select
                        id="inputState"
                        defaultValue=""
                        name="region"
                        {...props["inputState"]}
                        className={combinarClases("form-select controlFormulario", props["inputState"]?.className ?? "")}
                      >
                        {content["inputState"] ?? (
                          <>
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
                            <option value="la-araucania">
                              {"La Araucanía"}
                            </option>
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
                          </>
                        )}
                      </select>
                      {"\n              "}
                    </div>
                    {"\n              "}
                    <div className="col-12 col-md-6">
                      {"\n                "}
                      <label htmlFor="inputComuna" className="form-label etiquetaFormulario">
                        {"Comuna"}
                      </label>
                      {"\n                "}
                      <input
                        type="text"
                        id="inputComuna"
                        name="comuna"
                        autoComplete="address-level2"
                        placeholder="Comuna"
                        {...props["inputComuna"]}
                        className={combinarClases("form-control controlFormulario", props["inputComuna"]?.className ?? "")}
                      />
                      {"\n              "}
                    </div>
                    {"\n            "}
                  </div>
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
                      name="guardarDatos"
                      defaultValue="true"
                      {...props["gridCheck"]}
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
                  <button type="submit" className={combinarClases("btn botonPasteleria", "btn-zoom")}>
                    {"Registrarse"}
                  </button>
                  {"\n            "}
                  <a
                    href="../InicioSesion/iniciosesion.html"
                    className="text-center text-decoration-none mt-2 text-muted small"
                  >
                    {"¿Ya tienes cuenta? Inicia Sesión aquí"}
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
      {"\n    "}
      <Footer />
      {"\n    "}
      {"\n    "}
      {"\n  "}
    </>
  );
}
