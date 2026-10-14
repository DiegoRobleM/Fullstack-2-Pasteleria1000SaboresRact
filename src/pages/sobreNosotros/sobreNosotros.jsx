import { useTituloPagina } from "../../hooks/useTituloPagina.js";
import { paginas } from "../../app/pages.js";
import { combinarClases } from "../../utils/combinarClases.js";
import estilos from "./sobreNosotros.module.css";
import { BarraNavegacion } from "../../components/estructura/barraNavegacion.jsx";
import { PiePagina } from "../../components/estructura/piePagina.jsx";

export default function SobreNosotros() {
  useTituloPagina(paginas.SobreNosotros.title);

  return (
    <>
      <BarraNavegacion />

      <main className={estilos.pagina}>
        {/* BANNER HERO SOBRE NOSOTROS */}
        <section className={estilos.heroSobreNosotros}>
          <div className={estilos.heroContenido}>
            <span className={estilos.subtituloBadge}>{"Tradición & Pasión"}</span>
            <h1 className={estilos.tituloHero}>{"Sobre Nosotros"}</h1>
            <p className={estilos.bajadaHero}>
              {
                "Conoce la historia, los hitos y el compromiso dulcero que ha acompañado a miles de familias chilenas por medio siglo."
              }
            </p>
          </div>
        </section>

        <div className="container py-4">
          {/* SECCIÓN MISIÓN Y VISIÓN (2 CARDS ELEGANTES LADO A LADO) */}
          <section className="row g-4 mb-5">
            {/* Card Misión */}
            <div className="col-12 col-md-6">
              <div className={estilos.tarjetaProposito}>
                <div className={estilos.encabezadoProposito}>
                  <div className={estilos.iconoProposito}>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 8v8M8 12h8" />
                    </svg>
                  </div>
                  <h2>{"Nuestra Misión"}</h2>
                </div>
                <blockquote className={estilos.citaProposito}>
                  {
                    "\"Ofrecer una experiencia dulce y memorable a nuestros clientes, proporcionando tortas y productos de repostería de alta calidad para todas las ocasiones.\""
                  }
                </blockquote>
              </div>
            </div>

            {/* Card Visión */}
            <div className="col-12 col-md-6">
              <div className={estilos.tarjetaProposito}>
                <div className={estilos.encabezadoProposito}>
                  <div className={estilos.iconoProposito}>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  </div>
                  <h2>{"Nuestra Visión"}</h2>
                </div>
                <blockquote className={estilos.citaProposito}>
                  {
                    "\"Ser la pastelería líder en ventas online a nivel nacional, reconocida por nuestra innovación, sabor tradicional y el compromiso constante con la calidad de nuestros productos.\""
                  }
                </blockquote>
              </div>
            </div>
          </section>

          {/* CINTA DE ESTADÍSTICAS Y HITOS */}
          <section className={estilos.cintaEstadisticas}>
            <div className={estilos.itemEstadistica}>
              <span className={estilos.numeroEstadistica}>{"50+"}</span>
              <span className={estilos.etiquetaEstadistica}>{"Años de Tradición"}</span>
            </div>
            <div className={estilos.separadorEstadistica} />
            <div className={estilos.itemEstadistica}>
              <span className={estilos.numeroEstadistica}>{"1995"}</span>
              <span className={estilos.etiquetaEstadistica}>{"Récord Guinness"}</span>
            </div>
            <div className={estilos.separadorEstadistica} />
            <div className={estilos.itemEstadistica}>
              <span className={estilos.numeroEstadistica}>{"1000+"}</span>
              <span className={estilos.etiquetaEstadistica}>{"Recetas & Sabores"}</span>
            </div>
            <div className={estilos.separadorEstadistica} />
            <div className={estilos.itemEstadistica}>
              <span className={estilos.numeroEstadistica}>{"100%"}</span>
              <span className={estilos.etiquetaEstadistica}>{"Calidad Artesanal"}</span>
            </div>
          </section>

          {/* SECCIÓN TRAYECTORIA Y HITOS (BLOQUE CAFÉ CON CARDS BLANCAS) */}
          <section className={estilos.bloqueHitosCafe}>
            <div className={estilos.headerHitos}>
              <span className={estilos.badgeSeccion}>{"Orgullo & Reconocimiento"}</span>
              <h2 className={estilos.tituloSeccionHitos}>
                {"Nuestra Trayectoria"}
              </h2>
            </div>

            <div className="row g-4">
              {/* Card 1: 50 Aniversario y Guinness */}
              <div className="col-12 col-md-4">
                <div className={estilos.tarjetaHitoBlanca}>
                  <div className={estilos.contenedorImagenHito}>
                    <span className={estilos.etiquetaAnio}>{"1976 - 2026"}</span>
                    <img
                      src="/SobreNosotros/img/fotoPasteleria.jpeg"
                      alt="Historia de la pastelería"
                      className={estilos.imagenHito}
                    />
                  </div>
                  <div className={estilos.cuerpoHito}>
                    <h3 className={estilos.tituloHito}>{"50 Años de Historia"}</h3>
                    <p className={estilos.textoHito}>
                      {
                        "Pastelería 1000 Sabores celebra su 50 aniversario como un referente en la repostería chilena. Famosa por su participación en un récord Guinness en 1995, busca renovar su sitio web para ofrecer una experiencia moderna a sus clientes."
                      }
                    </p>
                  </div>
                </div>
              </div>

              {/* Card 2: Quequedrilo */}
              <div className="col-12 col-md-4">
                <div className={estilos.tarjetaHitoBlanca}>
                  <div className={estilos.contenedorImagenHito}>
                    <span className={estilos.etiquetaPremio}>{"Premio Internacional"}</span>
                    <img
                      src="/SobreNosotros/img/quequedrillo.webp"
                      alt="Quequedrilo"
                      className={estilos.imagenHito}
                    />
                  </div>
                  <div className={estilos.cuerpoHito}>
                    <h3 className={estilos.tituloHito}>{"Novedades: Quequedrilo"}</h3>
                    <p className={estilos.textoHito}>
                      {
                        "Pastelería 1000 Sabores inaugura su nuevo producto, el \"Quequedrilo\", ganador de diversos premios internacionales por su creativa confección y sabor único."
                      }
                    </p>
                    <div className={estilos.citaFuente}>
                      {"— Diario El País, 2019"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 3: Chefs & Televisión */}
              <div className="col-12 col-md-4">
                <div className={estilos.tarjetaHitoBlanca}>
                  <div className={estilos.contenedorImagenHito}>
                    <span className={estilos.etiquetaVisita}>{"Visitas Ilustres"}</span>
                    <img
                      src="/SobreNosotros/img/images.jpeg"
                      alt="Chefs destacados"
                      className={estilos.imagenHito}
                    />
                  </div>
                  <div className={estilos.cuerpoHito}>
                    <h3 className={estilos.tituloHito}>{"Grandes Maestros"}</h3>
                    <p className={estilos.textoHito}>
                      {
                        "Incorporación de destacados chefs a nivel nacional para enriquecer nuestras recetas tradicionales con técnicas modernas."
                      }
                    </p>
                    <div className={estilos.mencionPill}>
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                      <span>{"Nachito Pop, Jorge Zabaleta y \"Lugares que hablan\""}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <PiePagina />
    </>
  );
}