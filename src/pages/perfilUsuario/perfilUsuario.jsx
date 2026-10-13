import { combinarClases } from "../../utils/combinarClases.js";
import estilos from "./perfilUsuario.module.css";
import { Navbar } from "../../components/layout/Navbar.jsx";
import { Footer } from "../../components/layout/Footer.jsx";

// Estructura y textos de la pantalla original, conservados en JSX.
export default function PerfilUsuario({ props = {}, content = {} }) {
  return (
    <>
      {"\n    "}
      <Navbar />
      {"\n    "}
      <main className={estilos.contenedorPerfil}>
        {"\n      "}
        <div className={combinarClases(estilos.tarjetaPerfil, "text-center")}>
          {"\n        "}
          <h1 className={estilos.tituloPerfil}>
            {"\n          Perfil de usuario "}
            <i className="bi bi-cup-hot-fill"></i>
            {"\n        "}
          </h1>
          {"\n\n        "}
          <div className={estilos.contenidoPerfil}>
            {"\n          "}
            <div className="mt-4">
              {"\n            "}
              <img
                src="img/perfil.JPG"
                alt="Imagen de usuario"
                className={estilos.imagenPerfil}
              />
              {"\n          "}
            </div>
            {"\n          "}
            <div style={{ width: "18rem" }} className={`card ${estilos.tarjetaDatos}`}>
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
