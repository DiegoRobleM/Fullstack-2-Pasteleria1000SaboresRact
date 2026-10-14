import { useTituloPagina } from "../../hooks/useTituloPagina.js";
import { paginas } from "../../app/pages.js";
import { Link } from "react-router-dom";
import { combinarClases } from "../../utils/combinarClases.js";
import estilos from "./inicio.module.css";
import { BarraNavegacion } from "../../components/estructura/barraNavegacion.jsx";
import { PiePagina } from "../../components/estructura/piePagina.jsx";

export default function Inicio() {
  useTituloPagina(paginas.Inicio.title);

  return (
    <>
      <BarraNavegacion />

      <main className={estilos.pagina}>
        {/* BANNER HERO PRINCIPAL */}
        <section className={estilos.presentacion}>
          <div className={estilos.heroOverlay}>
            <div className={estilos.tarjetaHero}>
              <h2>{"Pastelería 1000 Sabores"}</h2>
              <div className={estilos.subtitulo}>
                <p>{"Entregando sabor desde 1976."}</p>
              </div>
              <div className={estilos.botonesCentrales}>
                <Link
                  to="/pasteleria"
                  className={combinarClases(
                    estilos.btnProductos,
                    "text-decoration-none",
                  )}
                >
                  {"Productos"}
                </Link>
                <Link
                  to="/sobre-nosotros"
                  className={combinarClases(
                    estilos.btnNosotros,
                    "text-decoration-none",
                  )}
                >
                  {"Nosotros"}
                </Link>
              </div>
            </div>
          </div>
        </section>

        <div className="container py-2">
          {/* SECCIÓN PRODUCTOS CON BLOQUE CAFÉ */}
          <section className={estilos.bloqueProductosCafe}>
            <div className={estilos.headerTituloDestacado}>
              <h2 className={estilos.tituloSeccionProductos}>
                {"Nuestros productos"}
              </h2>
            </div>

            <div
              className={combinarClases("row g-4", estilos.contenedorProductos)}
            >
              {/* Card 1: Pasteles */}
              <div className="col-12 col-md-4">
                <Link to="/pasteleria" className="text-decoration-none">
                  <div className={estilos.tarjetaProductoBlanca}>
                    <div className={estilos.cardHeader}>
                      <h5>{"Pasteles"}</h5>
                    </div>
                    <img
                      src="/Inicio/img/pasteles.jpg"
                      alt="Pasteles"
                      className={estilos.imagenProducto}
                    />
                  </div>
                </Link>
              </div>

              {/* Card 2: Panes */}
              <div className="col-12 col-md-4">
                <Link to="/panaderia" className="text-decoration-none">
                  <div className={estilos.tarjetaProductoBlanca}>
                    <div className={estilos.cardHeader}>
                      <h5>{"Panes"}</h5>
                    </div>
                    <img
                      src="/Inicio/img/panes.jpg"
                      alt="Panes"
                      className={estilos.imagenProducto}
                    />
                  </div>
                </Link>
              </div>

              {/* Card 3: Salados */}
              <div className="col-12 col-md-4">
                <Link to="/salados" className="text-decoration-none">
                  <div className={estilos.tarjetaProductoBlanca}>
                    <div className={estilos.cardHeader}>
                      <h5>{"Salados"}</h5>
                    </div>
                    <img
                      src="/Inicio/img/salados.jpg"
                      alt="Salados"
                      className={estilos.imagenProducto}
                    />
                  </div>
                </Link>
              </div>
            </div>
          </section>

          {/* SECCIÓN LOCALES E HISTORIA (UN SOLO CARD GRANDE CON FOTO Y TEXTO INTEGRADOS) */}
          <section className="mb-5">
            <div className="text-center mb-4">
              <h2 className={estilos.tituloBadgeCafe}>{"Nuestros locales"}</h2>
            </div>

            {/* Contenedor único grande */}
            <div className={estilos.tarjetaHistoriaGrande}>
              {/* Foto de Álbum integrada en la izquierda del card */}
              <a
                href="https://tinyurl.com/pasteleria1000"
                className="text-decoration-none"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className={estilos.marcoFotoAlbum}>
                  <img
                    src="/Inicio/img/Pasteleria.jpg.jpeg"
                    alt="Pastelería Local"
                    className={estilos.imagenFotoAlbum}
                  />
                  <span className={estilos.pieFotoAlbum}>
                    {"Dublé Almeyda 3141, Ñuñoa"}
                  </span>
                </div>
              </a>

              {/* Texto de la historia a la derecha dentro del mismo card */}
              <div className={estilos.contenidoHistoria}>
                <p className={estilos.textoParrafo}>
                  {
                    "Todo comenzó en la cocina de la Abuela Carmen, entre el aroma a vainilla fresca, una cuchara de palo desgastada y un cuaderno de tapas de cuero donde guardaba sus secretos mejor guardados. Entre todas sus creaciones, había una estrella indiscutida: su legendaria Torta Hojarasca con Manjar Artesanal y Nuez. Lo que empezó como el hito infaltable de los domingos familiares, pronto cruzó la puerta de la casa cuando los vecinos comenzaron a tocar la ventana pidiendo encargos para sus propios cumpleaños."
                  }
                </p>
                <p className={estilos.textoParrafo}>
                  {
                    "En 1976, empujados por el entusiasmo de un barrio entero enamorado de esa receta única, la familia decidió dar el salto y abrir las puertas de Pastelería 1000 Sabores. Aquel pastel de la abuela no solo se convirtió en el producto estrella, sino en la piedra angular de un negocio que creció basándose en el boca a boca, el cariño de hogar y el respeto por los ingredientes auténticos."
                  }
                </p>
                <p className={estilos.textoDestacado}>
                  {
                    "Ahora la tienda original se encuentra cerrada pero nos relocalizamos en Dublé Almeyda 3141, 7750000 Ñuñoa, Región Metropolitana."
                  }
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>

      <PiePagina />
    </>
  );
}
