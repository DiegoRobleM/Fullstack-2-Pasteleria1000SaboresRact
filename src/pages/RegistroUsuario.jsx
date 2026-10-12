import { Navbar } from "../components/layout/Navbar.jsx";
import { Footer } from "../components/layout/Footer.jsx";

// Estructura y textos de la pantalla original, conservados en JSX.
export default function RegistroUsuario({ props = {}, content = {} }) {
  return (
    <>
      {"\n    "}
      <Navbar />
      {"\n    "}
      <main className="contenedor-registro">
        {"\n      "}
        <div className="tarjeta-registro">
          {"\n        "}
          <h2 className="titulo-registro">{"Registro de Usuario"}</h2>
          {"\n        "}
          <div
            id="mensaje-registro"
            className="alert d-none"
            role="alert"
            {...props["mensaje-registro"]}
          >
            {content["mensaje-registro"] ?? <></>}
          </div>
          {"\n        "}
          <form id="form-registro" {...props["form-registro"]}>
            {content["form-registro"] ?? (
              <>
                {"\n          "}
                <div className="campo-grupo">
                  {"\n            "}
                  <div className="row g-2">
                    {"\n              "}
                    <div className="col-12 col-md-6">
                      {"\n                "}
                      <label htmlFor="nombre" className="form-label">
                        {"1. Nombre"}
                      </label>
                      {"\n                "}
                      <input
                        type="text"
                        className="form-control"
                        id="nombre"
                        name="nombre"
                        autoComplete="given-name"
                        placeholder="Nombre"
                        {...props["nombre"]}
                      />
                      {"\n              "}
                    </div>
                    {"\n              "}
                    <div className="col-12 col-md-6">
                      {"\n                "}
                      <label htmlFor="apellido" className="form-label">
                        {"Apellido"}
                      </label>
                      {"\n                "}
                      <input
                        type="text"
                        className="form-control"
                        id="apellido"
                        name="apellido"
                        autoComplete="family-name"
                        placeholder="Apellido"
                        {...props["apellido"]}
                      />
                      {"\n              "}
                    </div>
                    {"\n            "}
                  </div>
                  {"\n          "}
                </div>
                {"\n          "}
                <div className="campo-grupo">
                  {"\n            "}
                  <label htmlFor="inputEmail" className="f-label">
                    {"2. Correo electrónico"}
                  </label>
                  {"\n            "}
                  <input
                    type="email"
                    className="form-control"
                    id="inputEmail"
                    name="email"
                    autoComplete="email"
                    placeholder="Escribe aquí tu correo"
                    {...props["inputEmail"]}
                  />
                  {"\n          "}
                </div>
                {"\n          "}
                <div className="campo-grupo">
                  {"\n            "}
                  <label htmlFor="inputPassword" className="form-label">
                    {"3. Contraseña"}
                  </label>
                  {"\n            "}
                  <input
                    type="password"
                    className="form-control"
                    id="inputPassword"
                    name="password"
                    autoComplete="new-password"
                    placeholder="Mínimo 8 caracteres"
                    {...props["inputPassword"]}
                  />
                  {"\n          "}
                </div>
                {"\n          "}
                <div className="campo-grupo">
                  {"\n            "}
                  <label htmlFor="inputAddress" className="form-label">
                    {"4. Dirección de envío"}
                  </label>
                  {"\n            "}
                  <input
                    type="text"
                    className="form-control mb-2"
                    id="inputAddress"
                    name="direccion"
                    autoComplete="street-address"
                    placeholder="Escribe aquí tu dirección"
                    {...props["inputAddress"]}
                  />
                  {"\n            "}
                  <label htmlFor="inputAddress2" className="form-label">
                    {"Tipo de propiedad (opcional)"}
                  </label>
                  {"\n            "}
                  <input
                    type="text"
                    className="form-control"
                    id="inputAddress2"
                    name="tipoPropiedad"
                    placeholder="Departamento, casa, etc."
                    {...props["inputAddress2"]}
                  />
                  {"\n          "}
                </div>
                {"\n          "}
                <div className="campo-grupo">
                  {"\n            "}
                  <div className="row g-2">
                    {"\n              "}
                    <div className="col-12 col-md-6">
                      {"\n                "}
                      <label htmlFor="inputState" className="form-label">
                        {"5. Región"}
                      </label>
                      {"\n                "}
                      <select
                        id="inputState"
                        defaultValue=""
                        name="region"
                        className="form-select"
                        {...props["inputState"]}
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
                      <label htmlFor="inputComuna" className="form-label">
                        {"Comuna"}
                      </label>
                      {"\n                "}
                      <input
                        type="text"
                        className="form-control"
                        id="inputComuna"
                        name="comuna"
                        autoComplete="address-level2"
                        placeholder="Comuna"
                        {...props["inputComuna"]}
                      />
                      {"\n              "}
                    </div>
                    {"\n            "}
                  </div>
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
                  <button type="submit" className="btn btn-registrar btn-zoom">
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
