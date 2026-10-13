import { combinarClases } from "../../utils/combinarClases.js";
import estilos from "./inicio.module.css";
import { Navbar } from "../../components/layout/Navbar.jsx";
import { Footer } from "../../components/layout/Footer.jsx";

// Estructura y textos de la pantalla original, conservados en JSX.
export default function Inicio({ props = {}, content = {} }) {
  return (
    <>
      {"\n\n  "}
      <Navbar />
      {"\n\n  "}
      <main className={combinarClases("container my-5", estilos.pagina)}>
        {"\n    "}
        <section className="d-flex align-items-center gap-4 mb-5">
          {"\n          "}
          <div className={estilos.imagenCentral}>
            {"\n            "}
            <img
              src="img/Pasteleria.jpg.jpeg"
              className="img-thumbnail shadow-sm p-2 bg-white"
              alt="Pasteleria"
            />
            {"\n          "}
          </div>
          {"\n\n          "}
          <div className={estilos.textoCentral}>
            {"\n            "}
            <h2>{"Pastelería 1000 Sabores"}</h2>
            {"\n            "}
            <div className={estilos.subtitulo}>
              {"\n              "}
              <p>{"Entregando sabor desde 1976."}</p>
              {"\n            "}
            </div>
            {"\n            "}
            <div className={estilos.botonesCentrales}>
              {"\n              "}
              <a
                href="../Pasteleria/pasteleria.html" className={combinarClases("botonPasteleria text-decoration-none")}>
                {"Productos"}
              </a>
              {"\n              "}
              <a
                href="../SobreNosotros/sobrenosotros.html" className={combinarClases("botonPasteleria text-decoration-none")}>
                {"Nosotros"}
              </a>
              {"\n            "}
            </div>
            {"\n          "}
          </div>
          {"\n        "}
        </section>
        {"\n\n        "}
        <section className="mb-5">
          {"\n          "}
          <div className={estilos.tituloProductos}>
            {"\n            "}
            <h2 className="mb-4">{"Nuestros productos"}</h2>
            {"\n          "}
          </div>
          {"\n\n          "}
          <div className={combinarClases("row g-4", estilos.contenedorProductos)}>
            {"\n\n            "}
            <div className="col-12 col-md-4">
              {"\n              "}
              <a
                href="../Pasteleria/pasteleria.html"
                className="text-decoration-none text-dark"
              >
                {"\n                "}
                <div className={combinarClases("card", estilos.tarjetaProducto, "h-100", "shadow-sm", "text-center")}>
                  {"\n                  "}
                  <div className="card-body py-3">
                    {"\n                    "}
                    <h5 className="card-title fw-bold mb-0">{"Pasteles"}</h5>
                    {"\n                  "}
                  </div>
                  {"\n                  "}
                  <img
                    src="img/pasteles.jpg"
                    alt="Pastel de Chocolate"
                    className={combinarClases("card-img-bottom", estilos.imagenProducto)}
                  />
                  {"\n                "}
                </div>
                {"\n              "}
              </a>
              {"\n            "}
            </div>
            {"\n\n             "}
            <div className="col-12 col-md-4">
              {"\n              "}
              <a
                href="../Panaderia/index.html"
                className="text-decoration-none text-dark"
              >
                {"\n                "}
                <div className={combinarClases("card", estilos.tarjetaProducto, "h-100", "shadow-sm", "text-center")}>
                  {"\n                  "}
                  <div className="card-body py-3">
                    {"\n                    "}
                    <h5 className="card-title fw-bold mb-0">{"Panes"}</h5>
                    {"\n                  "}
                  </div>
                  {"\n                  "}
                  <img
                    src="img/panes.jpg"
                    alt="Pan Ciabatta"
                    className={combinarClases("card-img-bottom", estilos.imagenProducto)}
                  />
                  {"\n                "}
                </div>
                {"\n              "}
              </a>
              {"\n            "}
            </div>
            {" \n\n            "}
            <div className="col-12 col-md-4">
              {"\n              "}
              <a
                href="../Salados/index.html"
                className="text-decoration-none text-dark"
              >
                {"\n                "}
                <div className={combinarClases("card", estilos.tarjetaProducto, "h-100", "shadow-sm", "text-center")}>
                  {"\n                  "}
                  <div className="card-body py-3">
                    {"\n                    "}
                    <h5 className="card-title fw-bold mb-0">{"Salados"}</h5>
                    {"\n                  "}
                  </div>
                  {"\n                  "}
                  <img
                    src="img/salados.jpg"
                    alt="Salados"
                    className={combinarClases("card-img-bottom", estilos.imagenProducto)}
                  />
                  {"\n                "}
                </div>
                {"\n              "}
              </a>
              {"\n            "}
            </div>
            {"\n          "}
          </div>
          {"\n        "}
        </section>
        {"\n         "}
        <section className="mb-5">
          {"\n          "}
          <div className={estilos.tituloLocales}>
            {"\n            "}
            <h2 className="mb-4">{"Nuestros locales"}</h2>
            {"\n          "}
          </div>
          {"\n\n          "}
          <div className={combinarClases("row g-4", estilos.contenedorLocales)}>
            {"\n            "}
            <div className="col-12 col-md-4">
              {"\n              "}
              <a
                href="https://tinyurl.com/pasteleria1000"
                className="text-decoration-none text-dark"
              >
                {"\n                "}
                <div className={combinarClases("card", estilos.tarjetaLocal, "h-100", "shadow-sm", "text-center")}>
                  {"\n                  "}
                  <img
                    src="img/Pasteleria.jpg.jpeg"
                    alt="PasteleriaLocal"
                    className={combinarClases("card-img-bottom", estilos.imagenLocal)}
                  />
                  {"\n                "}
                </div>
                {"\n              "}
              </a>
              {"\n            "}
            </div>
            {"\n\n            "}
            <div className="col-12 col-md-4">
              {"\n                "}
              <div className={combinarClases("card", estilos.tarjetaHistoria, "h-100", "shadow-sm", "text-center")}>
                {"\n                  "}
                <div className="card-body py-3">
                  {"\n                    "}
                  <h3 className="card-title fw-bold mb-0">
                    {
                      "Todo comenzó en la cocina de la Abuela Carmen, \n                      entre el aroma a vainilla fresca, una cuchara de palo desgastada y un cuaderno de \n                      tapas de cuero donde guardaba sus secretos mejor guardados. \n                      Entre todas sus creaciones, había una estrella indiscutida: \n                      su legendaria Torta Hojarasca con Manjar Artesanal y Nuez. \n                      Lo que empezó como el hito infaltable de los domingos familiares, \n                      pronto cruzó la puerta de la casa cuando los vecinos comenzaron a tocar la ventana \n                      pidiendo encargos para sus propios cumpleaños. "
                    }
                  </h3>
                  {"\n                    "}
                  <h3 className="card-title fw-bold mb-0">
                    {
                      "En 1976, empujados por el entusiasmo de un barrio entero enamorado de \n                    esa receta única, la familia decidió dar el salto y abrir las puertas \n                    de Pastelería 1000 Sabores. Aquel pastel de la abuela no solo se convirtió\n                     en el producto estrella, sino en la piedra angular de un negocio \n                     que creció basándose en el boca a boca, el cariño de hogar y el\n                      respeto por los ingredientes auténticos."
                    }
                  </h3>
                  {"\n                      "}
                  <h3 className="card-title fw-bold mb-0">
                    {
                      "Ahora la tienda original se encuentra cerrada pero nos relocalizamos \n                        en Dublé Almeyda 3141, 7750000 Ñuñoa, Región Metropolitana "
                    }
                  </h3>
                  {"\n                  "}
                </div>
                {"\n\n                "}
              </div>
              {"\n              "}
              {"\n            "}
            </div>
            {"\n          "}
          </div>
          {"\n            "}
        </section>
        {"\n\n  "}
      </main>
      {"\n\n  "}
      <Footer />
      {"\n  "}
      {"\n  "}
      {"\n"}
    </>
  );
}
