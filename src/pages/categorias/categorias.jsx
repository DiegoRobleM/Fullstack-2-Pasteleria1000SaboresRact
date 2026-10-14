import { Link } from "react-router-dom";
import { BarraNavegacion } from "../../components/estructura/barraNavegacion.jsx";
import { PiePagina } from "../../components/estructura/piePagina.jsx";
import { useTituloPagina } from "../../hooks/useTituloPagina.js";
import { useTienda } from "../../context/ContextoTienda.jsx";
import { categorias } from "../../data/categorias.js";
export default function Categorias() {
  const { productos } = useTienda();
  useTituloPagina("Categorías - Pastelería 1000 Sabores");
  return (
    <>
      <BarraNavegacion />
      <main className="container my-5">
        <h1>Categorías</h1>
        <div className="row g-4 mt-2">
          {categorias.map((categoria) => (
            <div key={categoria.id} className="col-12 col-md-6">
              <article className="card h-100">
                <div className="card-body">
                  <h2 className="h4">{categoria.nombre}</h2>
                  <p>
                    {
                      productos.filter(
                        (producto) => producto.categoria === categoria.id,
                      ).length
                    }{" "}
                    productos disponibles
                  </p>
                  <Link to={"/" + categoria.id} className="btn botonPasteleria">
                    Ver {categoria.nombre.toLowerCase()}
                  </Link>
                </div>
              </article>
            </div>
          ))}
        </div>
      </main>
      <PiePagina />
    </>
  );
}
