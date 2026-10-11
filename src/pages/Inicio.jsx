import { Navbar, Footer } from "../components/Layout.jsx";

// Estructura y textos de la pantalla original, conservados en JSX.
export default function Inicio({ props = {}, content = {} }) {
  return (
    <>
      {"\n\n  "}
      <Navbar />
      {"\n\n  "}
      <main className="container my-5">
        {"\n    "}
        <section className="d-flex align-items-center gap-4 mb-5">
          {"\n          "}
          <div className="imgCentral">
            {"\n            "}
            <img
              src="img/Pasteleria.jpg.jpeg"
              className="img-thumbnail shadow-sm p-2 bg-white"
              alt="Pasteleria"
            />
            {"\n          "}
          </div>
          {"\n\n          "}
          <div className="textoCentral">
            {"\n            "}
            <h2>{"Pastelería 1000 Sabores"}</h2>
            {"\n            "}
            <div className="subtitulo">
              {"\n              "}
              <p>{"Entregando sabor desde 1976."}</p>
              {"\n            "}
            </div>
            {"\n            "}
            <div className="btnesCentral">
              {"\n              "}
              <a
                href="../Pasteleria/pasteleria.html"
                className="btn-Productos text-decoration-none"
              >
                {"Productos"}
              </a>
              {"\n              "}
              <a
                href="../SobreNosotros/sobrenosotros.html"
                className="btn-Nosotros text-decoration-none"
              >
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
          <div className="titulo-prod">
            {"\n            "}
            <h2 className="mb-4">{"Nuestros productos"}</h2>
            {"\n          "}
          </div>
          {"\n\n          "}
          <div className="row g-4 contenedor-prod">
            {"\n\n            "}
            <div className="col-12 col-md-4">
              {"\n              "}
              <a
                href="../Pasteleria/pasteleria.html"
                className="text-decoration-none text-dark"
              >
                {"\n                "}
                <div className="card tarjeta-producto h-100 shadow-sm text-center">
                  {"\n                  "}
                  <div className="card-body py-3">
                    {"\n                    "}
                    <h5 className="card-title fw-bold mb-0">{"Pasteles"}</h5>
                    {"\n                  "}
                  </div>
                  {"\n                  "}
                  <img
                    src="img/pasteles.jpg"
                    className="card-img-bottom img-producto"
                    alt="Pastel de Chocolate"
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
                <div className="card tarjeta-producto h-100 shadow-sm text-center">
                  {"\n                  "}
                  <div className="card-body py-3">
                    {"\n                    "}
                    <h5 className="card-title fw-bold mb-0">{"Panes"}</h5>
                    {"\n                  "}
                  </div>
                  {"\n                  "}
                  <img
                    src="img/panes.jpg"
                    className="card-img-bottom img-producto"
                    alt="Pan Ciabatta"
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
                <div className="card tarjeta-producto h-100 shadow-sm text-center">
                  {"\n                  "}
                  <div className="card-body py-3">
                    {"\n                    "}
                    <h5 className="card-title fw-bold mb-0">{"Salados"}</h5>
                    {"\n                  "}
                  </div>
                  {"\n                  "}
                  <img
                    src="img/salados.jpg"
                    className="card-img-bottom img-producto"
                    alt="Salados"
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
          <div className="titulo-loc">
            {"\n            "}
            <h2 className="mb-4">{"Nuestros locales"}</h2>
            {"\n          "}
          </div>
          {"\n\n          "}
          <div className="row g-4 contenedor-local">
            {"\n            "}
            <div className="col-12 col-md-4">
              {"\n              "}
              <a
                href="https://tinyurl.com/pasteleria1000"
                className="text-decoration-none text-dark"
              >
                {"\n                "}
                <div className="card tarjeta-local h-100 shadow-sm text-center">
                  {"\n                  "}
                  <img
                    src="img/Pasteleria.jpg.jpeg"
                    className="card-img-bottom img-local"
                    alt="PasteleriaLocal"
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
              <div className="card tarjeta-bg h-100 shadow-sm text-center">
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
