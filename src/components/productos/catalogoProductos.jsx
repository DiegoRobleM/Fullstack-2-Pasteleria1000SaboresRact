import { useState } from "react";
import { BarraNavegacion } from "../estructura/barraNavegacion.jsx";
import { PiePagina } from "../estructura/piePagina.jsx";
import { TarjetasProductos } from "./tarjetasProductos.jsx";
import Notificacion from "../notificacion/notificacion.jsx";
import Alerta from "../alerta/alerta.jsx";
import notificacion from "../notificacion/notificacion.module.css";
import estilos from "./catalogo.module.css";
import { useTienda } from "../../context/ContextoTienda.jsx";
import { useNotificacion } from "../../hooks/useNotificacion.js";
import { useTituloPagina } from "../../hooks/useTituloPagina.js";
import { precioFinal } from "../../utils/precios.js";

function obtenerTituloPagina(categoria, soloOfertas) {
  if (soloOfertas) return "Ofertas Especiales";
  if (!categoria) return "Nuestros Productos";

  const titulos = {
    panaderia: "Panadería Artesanal",
    pasteleria: "Pastelería Tradicional",
    salados: "Especialidades Saladas",
    "sin-azucar": "Productos Sin Azúcar",
  };

  return (
    titulos[categoria.toLowerCase()] ||
    categoria.charAt(0).toUpperCase() + categoria.slice(1)
  );
}

export default function CatalogoProductos({ categoria, soloOfertas = false }) {
  const { productos } = useTienda();
  const [busqueda, establecerBusqueda] = useState("");
  const [orden, establecerOrden] = useState("original");
  const { visible, notificar } = useNotificacion();

  const tituloSeccion = obtenerTituloPagina(categoria, soloOfertas);

  useTituloPagina(
    soloOfertas
      ? "Ofertas - Pastelería 1000 Sabores"
      : `${tituloSeccion} - Pastelería 1000 Sabores`,
  );

  const filtrados = productos.filter(
    (producto) =>
      (!categoria || producto.categoria === categoria) &&
      (!soloOfertas || Number(producto.descuento) > 0) &&
      (producto.titulo + " " + producto.descripcion)
        .toLocaleLowerCase("es")
        .includes(busqueda.trim().toLocaleLowerCase("es")),
  );

  if (orden !== "original") {
    filtrados.sort((a, b) =>
      orden === "menor"
        ? precioFinal(a) - precioFinal(b)
        : precioFinal(b) - precioFinal(a),
    );
  }

  return (
    <>
      <BarraNavegacion />

      <main className={estilos.pagina}>
        {/* BANNER HERO DEL CATÁLOGO */}
        <section className={estilos.heroCatalogo}>
          <div className={estilos.heroContenido}>
            <span className={estilos.subtituloBadge}>
              {"Nuestra Selección"}
            </span>
            <h1 className={estilos.tituloHero}>{tituloSeccion}</h1>
            <p className={estilos.bajadaHero}>
              {
                "Productos elaborados día a día con ingredientes frescos y la mejor tradición."
              }
            </p>
          </div>
        </section>

        <div className="container py-4">
          {/* BARRA DE CONTROLES (BÚSQUEDA Y ORDEN) */}
          <section className={estilos.tarjetaFiltros}>
            <div className="row g-3 align-items-end">
              {/* Buscador */}
              <div className="col-12 col-md-7 col-lg-8">
                <label
                  className={estilos.etiquetaCampo}
                  htmlFor="buscar-productos"
                >
                  <svg
                    className={estilos.iconoLabel}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                  {"Buscar productos"}
                </label>
                <input
                  id="buscar-productos"
                  type="search"
                  className={estilos.controlBusqueda}
                  value={busqueda}
                  onChange={(evento) => establecerBusqueda(evento.target.value)}
                  placeholder="Ej: Ciabatta, Torta, Empanada..."
                />
              </div>

              {/* Selector de Orden */}
              <div className="col-12 col-md-5 col-lg-4">
                <label
                  className={estilos.etiquetaCampo}
                  htmlFor="orden-productos"
                >
                  <svg
                    className={estilos.iconoLabel}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <line x1="12" y1="20" x2="12" y2="10" />
                    <line x1="18" y1="20" x2="18" y2="4" />
                    <line x1="6" y1="20" x2="6" y2="16" />
                  </svg>
                  {"Ordenar por"}
                </label>
                <select
                  id="orden-productos"
                  className={estilos.controlSelect}
                  value={orden}
                  onChange={(evento) => establecerOrden(evento.target.value)}
                >
                  <option value="original">Orden predeterminado</option>
                  <option value="menor">Menor precio</option>
                  <option value="mayor">Mayor precio</option>
                </select>
              </div>
            </div>
          </section>

          {/* RECTÁNGULO CAFÉ CONTENEDOR DE PRODUCTOS */}
          <section id="productos" className={estilos.bloqueProductosCafe}>
            <div className={estilos.headerProductos}>
              <h2 className={estilos.tituloBloque}>
                {soloOfertas ? "Ofertas Destacadas" : "Listado de Productos"}
              </h2>
            </div>

            <div className={estilos.contenedorProductos}>
              {filtrados.length ? (
                <TarjetasProductos
                  productos={filtrados}
                  notificar={notificar}
                />
              ) : (
                <Alerta className={estilos.tarjetaSinResultados}>
                  <div className={estilos.iconoSinResultados}>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <circle cx="11" cy="11" r="8" />
                      <line x1="21" y1="21" x2="16.65" y2="16.65" />
                      <line x1="8" y1="11" x2="14" y2="11" />
                    </svg>
                  </div>
                  <h3>{"No se encontraron productos"}</h3>
                  <p>
                    {
                      "Intenta buscar con otra palabra clave o restablece los filtros."
                    }
                  </p>
                </Alerta>
              )}
            </div>
          </section>
        </div>
      </main>

      <Notificacion
        id="toast-notificacion"
        className={visible ? notificacion.visible : notificacion.oculta}
      >
        🍰 ¡PRODUCTO AGREGADO A TU CARRITO!
      </Notificacion>

      <PiePagina />
    </>
  );
}
