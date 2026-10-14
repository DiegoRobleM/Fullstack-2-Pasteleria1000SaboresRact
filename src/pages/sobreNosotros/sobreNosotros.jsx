import { useTituloPagina } from "../../hooks/useTituloPagina.js";
import { paginas } from "../../app/pages.js";
import { combinarClases } from "../../utils/combinarClases.js";
import estilos from "./sobreNosotros.module.css";
import { BarraNavegacion } from "../../components/estructura/barraNavegacion.jsx";
import { PiePagina } from "../../components/estructura/piePagina.jsx";

// Estructura y textos de la pantalla original, conservados en JSX.
export default function SobreNosotros() {
  useTituloPagina(paginas.SobreNosotros.title);
  return (
    <>
      {"\n    "}
      <BarraNavegacion />
      {"\n\n    "}
      <main className={combinarClases("container my-3", estilos.pagina)}>
        {"\n      "}
        <section className="text-center mb-5">
          {"\n        "}
          <div className="contenerdor-mision">
            {"\n          "}
            <h1>{"Nuestra Misión"}</h1>
            {"\n          "}
            <p
              className={combinarClases(
                "lead text-muted",
                "mx-auto",
                estilos.fraseMision,
              )}
            >
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
            <div
              className={combinarClases(`card ${estilos.tarjeta}`, "shadow-sm")}
            >
              {"\n            "}
              <img
                src="/SobreNosotros/img/fotoPasteleria.jpeg"
                alt="Historia de la pastelería"
                className={`card-img-top ${estilos.imagenTarjeta}`}
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
            <div className={`card ${estilos.tarjeta}`}>
              {"\n            "}
              <img
                src="/SobreNosotros/img/quequedrillo.webp"
                alt="Quequedrilo"
                className={`card-img-top ${estilos.imagenTarjeta}`}
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
            <div className={`card ${estilos.tarjeta}`}>
              {"\n            "}
              <img
                src="/SobreNosotros/img/images.jpeg"
                alt="Chefs"
                className={`card-img-top ${estilos.imagenTarjeta}`}
              />
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
          <p
            className={combinarClases(
              "lead text-muted",
              "mx-auto",
              estilos.fraseVision,
            )}
          >
            {
              '\n          "Ser la pastelería líder en ventas online a nivel nacional, reconocida\n          por nuestra innovación, sabor tradicional y el compromiso constante\n          con la calidad de nuestros productos."\n        '
            }
          </p>
          {"\n      "}
        </section>
        {"\n    "}
      </main>
      {"\n\n    "}
      <PiePagina />
      {"\n\n    "}
      {"\n    "}
      {"\n  "}
    </>
  );
}
