import catalogo from "../../components/products/catalogo.module.css";
import Notificacion from "../../components/notificacion/notificacion.jsx";
import { Navbar } from "../../components/layout/Navbar.jsx";
import { Footer } from "../../components/layout/Footer.jsx";

// Estructura y textos de la pantalla original, conservados en JSX.
export default function Panaderia({ props = {}, content = {} }) {
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
              <div {...props["catalogo"]} className={catalogo.contenedorProductos}>
                {content["catalogo"] ?? <></>}
              </div>
              {"\n    "}
            </>
          )}
        </section>
        {"\n  "}
      </main>
      {"\n\n  "}
      <Notificacion
        id="toast-notificacion"
        {...props["toast-notificacion"]}
      >
        {content["toast-notificacion"] ?? (
          <>{"\n    🍰 ¡PRODUCTO AGREGADO A TU CARRITO!\n  "}</>
        )}
      </Notificacion>
      {"\n  "}
      <Footer />
      {"\n\n  "}
      {"\n  "}
      {"\n  "}
      {"\n"}
    </>
  );
}
