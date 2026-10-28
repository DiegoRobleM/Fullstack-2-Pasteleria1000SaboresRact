import { Link } from "react-router-dom";
import { BarraNavegacion } from "../../components/estructura/barraNavegacion.jsx";
import { PiePagina } from "../../components/estructura/piePagina.jsx";
import { useTituloPagina } from "../../hooks/useTituloPagina.js";
import { useTienda } from "../../context/ContextoTienda.jsx";
import { categorias } from "../../data/categorias.js";
import estilos from "./categorias.module.css";

// Función auxiliar para renderizar un ícono SVG según la categoría
function obtenerIconoCategoria(id) {
  switch (id) {
    case "pasteleria":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8" />
          <path d="M4 16s.5-1 2-1 2.5 1 4 1 2.5-1 4-1 2.5 1 4 1 2 0 2-1" />
          <path d="M2 21h20" />
          <path d="M7 8v2M12 8v2M17 8v2" />
          <circle cx="12" cy="5" r="2" />
        </svg>
      );
    case "panaderia":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M4 10a8 8 0 0 1 16 0v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-7z" />
          <line x1="8" y1="12" x2="8" y2="16" />
          <line x1="12" y1="11" x2="12" y2="16" />
          <line x1="16" y1="12" x2="16" y2="16" />
        </svg>
      );
    case "salados":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
          <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
          <line x1="6" y1="1" x2="6" y2="4" />
          <line x1="10" y1="1" x2="10" y2="4" />
          <line x1="14" y1="1" x2="14" y2="4" />
        </svg>
      );
    default:
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      );
  }
}

export default function Categorias() {
  const { productos } = useTienda();
  useTituloPagina("Categorías - Pastelería 1000 Sabores");

  return (
    <>
      <BarraNavegacion />

      <main className={estilos.pagina}>
        {/* BANNER HERO CATEGORÍAS */}
        <section className={estilos.heroCategorias}>
          <div className={estilos.heroContenido}>
            <span className={estilos.subtituloBadge}>{"Nuestra Oferta"}</span>
            <h1 className={estilos.tituloHero}>{"Categorías"}</h1>
            <p className={estilos.bajadaHero}>
              {
                "Explora nuestras especialidades artesanales, preparadas con recetas tradicionales e ingredientes seleccionados."
              }
            </p>
          </div>
        </section>

        <div className="container py-5">
          {/* BLOQUE DE CONTENIDO PRINCIPAL EN RECTÁNGULO CAFÉ */}
          <section className={estilos.bloqueCategoriasCafe}>
            <div className={estilos.headerSeccion}>
              <h2 className={estilos.tituloBloque}>
                {"Especialidades de la Casa"}
              </h2>
            </div>

            <div className="row g-4">
              {categorias.map((categoria) => {
                const cantidadProductos = productos.filter(
                  (producto) => producto.categoria === categoria.id,
                ).length;

                return (
                  <div key={categoria.id} className="col-12 col-md-6">
                    <article className={estilos.tarjetaCategoriaBlanca}>
                      <div className={estilos.iconoWrapper}>
                        {obtenerIconoCategoria(categoria.id)}
                      </div>

                      <div className={estilos.contenidoCard}>
                        <h2 className={estilos.nombreCategoria}>
                          {categoria.nombre}
                        </h2>

                        <span className={estilos.badgeDisponibles}>
                          {cantidadProductos}{" "}
                          {cantidadProductos === 1
                            ? "producto disponible"
                            : "productos disponibles"}
                        </span>

                        <div className={estilos.contenedorBoton}>
                          <Link
                            to={"/" + categoria.id}
                            className={estilos.btnCategoria}
                          >
                            <span>Ver {categoria.nombre.toLowerCase()}</span>
                            <svg
                              className={estilos.flechaBoton}
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <line x1="5" y1="12" x2="19" y2="12" />
                              <polyline points="12 5 19 12 12 19" />
                            </svg>
                          </Link>
                        </div>
                      </div>
                    </article>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </main>

      <PiePagina />
    </>
  );
}
