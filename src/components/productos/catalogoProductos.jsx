import { useState } from "react";
import { BarraNavegacion } from "../estructura/barraNavegacion.jsx";
import { PiePagina } from "../estructura/piePagina.jsx";
import { TarjetasProductos } from "./tarjetasProductos.jsx";
import Notificacion from "../notificacion/notificacion.jsx";
import notificacion from "../notificacion/notificacion.module.css";
import estilos from "./catalogo.module.css";
import { useTienda } from "../../context/ContextoTienda.jsx";
import { useNotificacion } from "../../hooks/useNotificacion.js";
import { useTituloPagina } from "../../hooks/useTituloPagina.js";
import { precioFinal } from "../../utils/precios.js";
export default function CatalogoProductos({ categoria, soloOfertas = false }) {
  const { productos } = useTienda();
  const [busqueda, establecerBusqueda] = useState("");
  const [orden, establecerOrden] = useState("original");
  const { visible, notificar } = useNotificacion();
  useTituloPagina(
    soloOfertas ? "Ofertas - Pastelería 1000 Sabores" : "Productos",
  );
  const filtrados = productos.filter(
    (producto) =>
      (!categoria || producto.categoria === categoria) &&
      (!soloOfertas || Number(producto.descuento) > 0) &&
      (producto.titulo + " " + producto.descripcion)
        .toLocaleLowerCase("es")
        .includes(busqueda.trim().toLocaleLowerCase("es")),
  );
  if (orden !== "original")
    filtrados.sort((a, b) =>
      orden === "menor"
        ? precioFinal(a) - precioFinal(b)
        : precioFinal(b) - precioFinal(a),
    );
  return (
    <>
      <BarraNavegacion />
      <main>
        <div className="container py-3">
          {soloOfertas && <h1 className="h2">Ofertas</h1>}
          <div className="row g-3">
            <div className="col-12 col-md-8">
              <label className="form-label" htmlFor="buscar-productos">
                Buscar productos
              </label>
              <input
                id="buscar-productos"
                type="search"
                className="form-control"
                value={busqueda}
                onChange={(evento) => establecerBusqueda(evento.target.value)}
                placeholder="Nombre o descripción"
              />
            </div>
            <div className="col-12 col-md-4">
              <label className="form-label" htmlFor="orden-productos">
                Ordenar por
              </label>
              <select
                id="orden-productos"
                className="form-select"
                value={orden}
                onChange={(evento) => establecerOrden(evento.target.value)}
              >
                <option value="original">Orden original</option>
                <option value="menor">Menor precio</option>
                <option value="mayor">Mayor precio</option>
              </select>
            </div>
          </div>
        </div>
        <section id="productos">
          <div className={estilos.contenedorProductos}>
            {filtrados.length ? (
              <TarjetasProductos productos={filtrados} notificar={notificar} />
            ) : (
              <p role="status" className="alert alert-info">
                No se encontraron productos.
              </p>
            )}
          </div>
        </section>
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
