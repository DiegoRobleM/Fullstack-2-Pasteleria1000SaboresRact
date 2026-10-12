import { Navbar } from "../components/layout/Navbar.jsx";
import { Footer } from "../components/layout/Footer.jsx";

// Estructura y textos de la pantalla original, conservados en JSX.
export default function SobreNosotros({ props = {}, content = {} }) {
  return (
    <>
      {"\n    "}
      <Navbar />
      {"\n\n    "}
      <main className="container my-3">
        {"\n      "}
        <section className="text-center mb-5">
          {"\n        "}
          <div className="contenerdor-mision">
            {"\n          "}
            <h1>{"Nuestra Misión"}</h1>
            {"\n          "}
            <p className="lead text-muted mx-auto frase-mision">
              {
                '\n            "Ofrecer una experiencia dulce y memorable a nuestros clientes,\n            proporcionando tortas y productos de repostería de alta calidad para\n            todas las ocasiones."\n          '
              }
            </p>
            {"\n        "}
          </div>
          {"\n      "}
        </section>
        {"\n\n      "}
        <div className="d-flex justify-content-center">
          {"\n        "}
          <section className="d-flex flex-wrap justify-content-center align-items-stretch gap-4 mb-4">
            {"\n          "}
            <div className="card shadow-sm">
              {"\n            "}
              <img
                src="img/fotoPasteleria.jpeg"
                className="card-img-top"
                alt="Historia de la pastelería"
              />
              {"\n\n            "}
              <div className="card-body">
                {"\n              "}
                <p className="card-text">
                  {
                    "\n                Pastelería 1000 Sabores celebra su 50 aniversario como un\n                referente en la repostería chilena. Famosa por su participación\n                en un récord Guinness en 1995, busca renovar su sitio web para\n                ofrecer una experiencia moderna a sus clientes.\n              "
                  }
                </p>
                {"\n            "}
              </div>
              {"\n          "}
            </div>
            {"\n          "}
            <div className="card">
              {"\n            "}
              <img
                src="img/quequedrillo.webp"
                className="card-img-top"
                alt="Quequedrilo"
              />
              {"\n            "}
              <div className="card-body">
                {"\n              "}
                <h5 className="card-title">{"Novedades:"}</h5>
                {"\n              "}
                <p className="card-text">
                  {
                    '\n                Pastelería 1000 Sabores inaugura su nuevo producto, el\n                "Quequedrilo", ganador de diversos premios internacionales.\n              '
                  }
                </p>
                {"\n              "}
                <p className="card-text">{"— Diario El País, 2019"}</p>
                {"\n            "}
              </div>
              {"\n          "}
            </div>
            {"\n\n          "}
            <div className="card">
              {"\n            "}
              <img src="img/images.jpeg" className="card-img-top" alt="Chefs" />
              {"\n\n            "}
              <div className="card-body">
                {"\n              "}
                <p className="card-text">
                  {
                    "\n                Incorporacion de destacados Chef a nivel nacional.\n              "
                  }
                </p>
                {"\n\n              "}
                <p>{"Nachito Pop, Jorge Zabaleta y lugares que hablan"}</p>
                {"\n            "}
              </div>
              {"\n          "}
            </div>
            {"\n        "}
          </section>
          {"\n      "}
        </div>
        {"\n\n      "}
        <section className="text-center mb-2">
          {"\n        "}
          <h2 className="fw-bold mb-3">{"Nuestra Visión"}</h2>
          {"\n        "}
          <p className="lead text-muted mx-auto frase-vision">
            {
              '\n          "Ser la pastelería líder en ventas online a nivel nacional, reconocida\n          por nuestra innovación, sabor tradicional y el compromiso constante\n          con la calidad de nuestros productos."\n        '
            }
          </p>
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
