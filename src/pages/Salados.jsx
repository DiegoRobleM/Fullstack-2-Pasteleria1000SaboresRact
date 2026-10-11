import { Navbar, Footer } from "../components/Layout.jsx";

// Estructura y textos de la pantalla original, conservados en JSX.
export default function Salados({ props = {}, content = {} }) {
  return (
    <>
      {"\n  "}
      <Navbar />
      {"\n\n  "}
      <main>
        {"\n    "}
        <section id="productos" {...props["productos"]}>
          {content["productos"] ?? (
            <>
              {"\n      "}
              <div className="contenedorProductos" {...props["catalogo"]}>
                {content["catalogo"] ?? <></>}
              </div>
              {"\n    "}
            </>
          )}
        </section>
        {"\n  "}
      </main>
      {"\n\n  "}
      <div
        id="toast-notificacion"
        className="toast-oculto"
        {...props["toast-notificacion"]}
      >
        {content["toast-notificacion"] ?? (
          <>{"\n    🍰 ¡PRODUCTO AGREGADO A TU CARRITO!\n  "}</>
        )}
      </div>
      {"\n\n  "}
      <Footer />
      {"\n\n  "}
      {"\n  "}
      {"\n  "}
      {"\n"}
    </>
  );
}
