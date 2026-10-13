import { Navbar } from "../../components/layout/Navbar.jsx";
import { Footer } from "../../components/layout/Footer.jsx";

// Estructura y textos de la pantalla original, conservados en JSX.
export default function Carrito({ props = {}, content = {} }) {
  return (
    <>
      {"\n    "}
      <Navbar />
      {"\n\n    "}
      <main className="container my-5">
        {"\n      "}
        <h1 className="text-center mb-4">{"Carrito de compras"}</h1>
        {"\n\n      "}
        <section id="carrito" {...props["carrito"]}>
          {content["carrito"] ?? <></>}
        </section>
        {"\n\n      "}
        <section className="text-end mt-4">
          {"\n        "}
          <h3>
            {"Total: "}
            <span id="total" {...props["total"]}>
              {content["total"] ?? <>{"$0"}</>}
            </span>
          </h3>
          {"\n        "}
          <button
            type="button"
            id="btn-vaciar"
            className="btn btn-outline-secondary mt-3"
            {...props["btn-vaciar"]}
          >
            {content["btn-vaciar"] ?? (
              <>{"\n          Vaciar carrito\n        "}</>
            )}
          </button>
          {"\n      "}
        </section>
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
