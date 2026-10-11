import { Navbar, Footer } from "../components/Layout.jsx";

// Estructura y textos de la pantalla original, conservados en JSX.
export default function Administrador({ props = {}, content = {} }) {
  return (
    <>
      {"\n    "}
      <Navbar />
      {"\n\n    "}
      <main
        id="panel-admin"
        className="container py-5 d-none"
        {...props["panel-admin"]}
      >
        {content["panel-admin"] ?? (
          <>
            {"\n      "}
            <div className="mb-5">
              {"\n        "}
              <h1 className="titulo-admin">{"Panel de administración"}</h1>
              {"\n\n        "}
              <p
                id="saludo-admin"
                className="text-muted"
                {...props["saludo-admin"]}
              >
                {content["saludo-admin"] ?? <></>}
              </p>
              {"\n      "}
            </div>
            {"\n\n      "}
            <div className="row g-4">
              {"\n        "}
              <div className="col-12 col-md-4">
                {"\n          "}
                <article className="card admin-card h-100">
                  {"\n            "}
                  <div className="card-body">
                    {"\n              "}
                    <i className="bi bi-chat-left-text icono-admin"></i>
                    {"\n\n              "}
                    <h2 className="card-title h4 mt-3">{"Consultas"}</h2>
                    {"\n\n              "}
                    <p className="card-text">
                      {
                        "\n                Revisar las consultas enviadas por los usuarios.\n              "
                      }
                    </p>
                    {"\n\n              "}
                    <button
                      type="button"
                      id="btn-ver-consultas"
                      className="btn btn-outline-dark"
                      {...props["btn-ver-consultas"]}
                    >
                      {content["btn-ver-consultas"] ?? (
                        <>{"\n                Ver consultas\n              "}</>
                      )}
                    </button>
                    {"\n            "}
                  </div>
                  {"\n          "}
                </article>
                {"\n        "}
              </div>
              {"\n\n        "}
              <div className="col-12 col-md-4">
                {"\n          "}
                <article className="card admin-card h-100">
                  {"\n            "}
                  <div className="card-body">
                    {"\n              "}
                    <i className="bi bi-cake2 icono-admin"></i>
                    {"\n\n              "}
                    <h2 className="card-title h4 mt-3">{"Productos"}</h2>
                    {"\n\n              "}
                    <p className="card-text">
                      {
                        "\n                Revisar los productos publicados en cada categoría.\n              "
                      }
                    </p>
                    {"\n\n              "}
                    <button
                      type="button"
                      id="btn-ver-productos"
                      className="btn btn-outline-dark"
                      {...props["btn-ver-productos"]}
                    >
                      {content["btn-ver-productos"] ?? (
                        <>{"\n                Ver productos\n              "}</>
                      )}
                    </button>
                    {"\n            "}
                  </div>
                  {"\n          "}
                </article>
                {"\n        "}
              </div>
              {"\n\n        "}
              <div className="col-12 col-md-4">
                {"\n          "}
                <article className="card admin-card h-100">
                  {"\n            "}
                  <div className="card-body">
                    {"\n              "}
                    <i className="bi bi-people icono-admin"></i>
                    {"\n\n              "}
                    <h2 className="card-title h4 mt-3">{"Usuarios"}</h2>
                    {"\n\n              "}
                    <p className="card-text">
                      {
                        "\n                Ver las cuentas registradas en este navegador.\n              "
                      }
                    </p>
                    {"\n\n              "}
                    <button
                      type="button"
                      id="btn-ver-usuarios"
                      className="btn btn-outline-dark"
                      {...props["btn-ver-usuarios"]}
                    >
                      {content["btn-ver-usuarios"] ?? (
                        <>{"\n                Ver usuarios\n              "}</>
                      )}
                    </button>
                    {"\n            "}
                  </div>
                  {"\n          "}
                </article>
                {"\n        "}
              </div>
              {"\n      "}
            </div>
            {"\n      "}
            <section
              id="seccion-productos"
              className="mt-5 d-none"
              {...props["seccion-productos"]}
            >
              {content["seccion-productos"] ?? (
                <>
                  {"\n        "}
                  <h2 className="h3 mb-3">{"Catálogos publicados"}</h2>
                  {"\n\n        "}
                  <div className="row g-3">
                    {"\n          "}
                    <div className="col-12 col-md-6">
                      {"\n            "}
                      <a
                        href="../Pasteleria/pasteleria.html"
                        className="btn btn-outline-dark w-100 py-3"
                      >
                        {"\n              Pastelería\n            "}
                      </a>
                      {"\n          "}
                    </div>
                    {"\n\n          "}
                    <div className="col-12 col-md-6">
                      {"\n            "}
                      <a
                        href="../Panaderia/index.html"
                        className="btn btn-outline-dark w-100 py-3"
                      >
                        {"\n              Panadería\n            "}
                      </a>
                      {"\n          "}
                    </div>
                    {"\n\n          "}
                    <div className="col-12 col-md-6">
                      {"\n            "}
                      <a
                        href="../Salados/index.html"
                        className="btn btn-outline-dark w-100 py-3"
                      >
                        {"\n              Productos salados\n            "}
                      </a>
                      {"\n          "}
                    </div>
                    {"\n\n          "}
                    <div className="col-12 col-md-6">
                      {"\n            "}
                      <a
                        href="../SinAzucar/sugar.html"
                        className="btn btn-outline-dark w-100 py-3"
                      >
                        {"\n              Productos sin azúcar\n            "}
                      </a>
                      {"\n          "}
                    </div>
                    {"\n        "}
                  </div>
                  {"\n      "}
                </>
              )}
            </section>
            {"\n      "}
            <section
              id="seccion-consultas"
              className="mt-5 d-none"
              {...props["seccion-consultas"]}
            >
              {content["seccion-consultas"] ?? (
                <>
                  {"\n        "}
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    {"\n          "}
                    <h2 className="h3 mb-0">{"Consultas recibidas"}</h2>
                    {"\n\n          "}
                    <span
                      id="total-consultas"
                      className="badge text-bg-dark"
                      {...props["total-consultas"]}
                    >
                      {content["total-consultas"] ?? <>{" 0 "}</>}
                    </span>
                    {"\n        "}
                  </div>
                  {"\n\n        "}
                  <div
                    id="sin-consultas"
                    className="alert alert-info d-none"
                    role="status"
                    {...props["sin-consultas"]}
                  >
                    {content["sin-consultas"] ?? (
                      <>
                        {
                          "\n          Todavía no se han recibido consultas.\n        "
                        }
                      </>
                    )}
                  </div>
                  {"\n\n        "}
                  <div
                    id="contenedor-tabla-consultas"
                    className="table-responsive"
                    {...props["contenedor-tabla-consultas"]}
                  >
                    {content["contenedor-tabla-consultas"] ?? (
                      <>
                        {"\n          "}
                        <table className="table table-striped table-hover align-middle">
                          <thead>
                            <tr>
                              <th scope="col">{"Fecha"}</th>

                              <th scope="col">{"Correo"}</th>

                              <th scope="col">{"Consulta"}</th>

                              <th scope="col">{"Estado"}</th>
                            </tr>
                          </thead>

                          <tbody
                            id="tabla-consultas"
                            {...props["tabla-consultas"]}
                          >
                            {content["tabla-consultas"] ?? <></>}
                          </tbody>
                        </table>
                        {"\n        "}
                      </>
                    )}
                  </div>
                  {"\n      "}
                </>
              )}
            </section>
            {"\n\n      "}
            <section
              id="seccion-usuarios"
              className="mt-5 d-none"
              {...props["seccion-usuarios"]}
            >
              {content["seccion-usuarios"] ?? (
                <>
                  {"\n        "}
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    {"\n          "}
                    <h2 className="h3 mb-0">{"Usuarios registrados"}</h2>
                    {"\n\n          "}
                    <span
                      id="total-usuarios"
                      className="badge text-bg-dark"
                      {...props["total-usuarios"]}
                    >
                      {content["total-usuarios"] ?? <>{" 0 "}</>}
                    </span>
                    {"\n        "}
                  </div>
                  {"\n\n        "}
                  <div
                    id="sin-usuarios"
                    className="alert alert-info d-none"
                    role="status"
                    {...props["sin-usuarios"]}
                  >
                    {content["sin-usuarios"] ?? (
                      <>
                        {
                          "\n          Todavía no existen usuarios registrados.\n        "
                        }
                      </>
                    )}
                  </div>
                  {"\n\n        "}
                  <div
                    id="contenedor-tabla-usuarios"
                    className="table-responsive"
                    {...props["contenedor-tabla-usuarios"]}
                  >
                    {content["contenedor-tabla-usuarios"] ?? (
                      <>
                        {"\n          "}
                        <table className="table table-striped table-hover align-middle">
                          <thead>
                            <tr>
                              <th scope="col">{"Nombre"}</th>

                              <th scope="col">{"Correo"}</th>

                              <th scope="col">{"Región"}</th>

                              <th scope="col">{"Comuna"}</th>

                              <th scope="col">{"Tipo de propiedad"}</th>

                              <th scope="col">{"Rol"}</th>
                            </tr>
                          </thead>

                          <tbody
                            id="tabla-usuarios"
                            {...props["tabla-usuarios"]}
                          >
                            {content["tabla-usuarios"] ?? <></>}
                          </tbody>
                        </table>
                        {"\n        "}
                      </>
                    )}
                  </div>
                  {"\n      "}
                </>
              )}
            </section>
            {"\n    "}
          </>
        )}
      </main>
      {"\n\n    "}
      <Footer />
      {"\n\n    "}
      {"\n    "}
      {"\n  "}
    </>
  );
}
