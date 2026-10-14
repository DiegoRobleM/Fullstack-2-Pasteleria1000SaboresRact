import { Link } from "react-router-dom";
import { BarraNavegacion } from "../../components/estructura/barraNavegacion.jsx";
import { PiePagina } from "../../components/estructura/piePagina.jsx";
import { useTituloPagina } from "../../hooks/useTituloPagina.js";
export default function CompraFallida() {
  useTituloPagina("Pago rechazado - Pastelería 1000 Sabores");
  return (
    <>
      <BarraNavegacion />
      <main className="container my-5">
        <h1>No se pudo completar el pago</h1>
        <p className="alert alert-warning" role="alert">
          El pago simulado fue rechazado. Tu carrito sigue disponible y no se ha
          registrado ningún pedido.
        </p>
        <div className="d-flex flex-wrap gap-3">
          <Link className="btn botonPasteleria" to="/checkout">
            Volver a intentar
          </Link>
          <Link className="btn btn-outline-dark" to="/carrito">
            Revisar carrito
          </Link>
        </div>
      </main>
      <PiePagina />
    </>
  );
}
