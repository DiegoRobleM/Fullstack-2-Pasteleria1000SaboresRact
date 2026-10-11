import { Navbar, Footer } from "../components/Layout.jsx";

// Estructura y textos de la pantalla original, conservados en JSX.
export default function PerfilUsuario({ props = {}, content = {} }) {
  return (
    <>
      {"\n    "}
      <Navbar />
      {"\n    "}
      <main className="contenedor-Perfil">
        {"\n      "}
        <div className="tarjeta-perfil text-center">
          {"\n        "}
          <h1 className="titulo-Perfil">
            {"\n          Perfil de usuario "}
            <i className="bi bi-cup-hot-fill"></i>
            {"\n        "}
          </h1>
          {"\n\n        "}
          <div className="contenedor-dentro">
            {"\n          "}
            <div className="mt-4">
              {"\n            "}
              <img
                src="img/perfil.JPG"
                alt="Imagen de usuario"
                className="img-Perfil"
              />
              {"\n          "}
            </div>
            {"\n          "}
            <div className="card" style={{ width: "18rem" }}>
              {"\n            "}
              <div
                className="card-header"
                id="perfil-nombre"
                {...props["perfil-nombre"]}
              >
                {content["perfil-nombre"] ?? (
                  <>{"\n              Cargando usuario...\n            "}</>
                )}
              </div>
              {"\n\n            "}
              <ul className="list-group list-group-flush">
                {"\n              "}
                <li className="list-group-item">
                  {"\n                "}
                  <strong>{"Correo:"}</strong>
                  {"\n                "}
                  <span id="perfil-email" {...props["perfil-email"]}>
                    {content["perfil-email"] ?? <></>}
                  </span>
                  {"\n              "}
                </li>
                {"\n\n              "}
                <li className="list-group-item">
                  {"\n                "}
                  <strong>{"Dirección:"}</strong>
                  {"\n                "}
                  <span id="perfil-direccion" {...props["perfil-direccion"]}>
                    {content["perfil-direccion"] ?? <></>}
                  </span>
                  {"\n              "}
                </li>
                {"\n\n              "}
                <li className="list-group-item">
                  {"\n                "}
                  <strong>{"Último pedido:"}</strong>
                  {"\n                Sin pedidos registrados\n              "}
                </li>
                {"\n            "}
              </ul>
              {"\n\n            "}
              <div className="card-body">
                {"\n              "}
                <button
                  type="button"
                  id="btn-cerrar-sesion"
                  className="btn btn-outline-danger w-100"
                  {...props["btn-cerrar-sesion"]}
                >
                  {content["btn-cerrar-sesion"] ?? (
                    <>{"\n                Cerrar sesión\n              "}</>
                  )}
                </button>
                {"\n            "}
              </div>
              {"\n          "}
            </div>
            {"\n        "}
          </div>
          {"\n      "}
        </div>
        {"\n    "}
      </main>
      {"\n\n    "}
      <Footer />
      {"\n\n    "}
      {"\n    "}
      {"\n  "}
    </>
  );
}
