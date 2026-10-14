import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BarraNavegacion } from "../../components/estructura/barraNavegacion.jsx";
import { PiePagina } from "../../components/estructura/piePagina.jsx";
import { useTienda } from "../../context/ContextoTienda.jsx";
import { useTituloPagina } from "../../hooks/useTituloPagina.js";
import { opcionesEntrega } from "../../services/pedidos.js";
import { totalCarrito, precioFinal } from "../../utils/precios.js";
import { formatearPrecio } from "../../utils/formatoPrecio.js";
import estilos from "./checkout.module.css";
import Alerta from "../../components/alerta/alerta.jsx";

export default function Checkout() {
  const { carrito, usuario, confirmarCompra } = useTienda();
  const [datos, establecerDatos] = useState(() => ({
    nombre: [usuario?.nombre, usuario?.apellido].filter(Boolean).join(" "),
    email: usuario?.email || "",
    direccion: usuario?.direccion || "",
    comuna: usuario?.comuna || "",
    region: usuario?.region || "",
    entrega: "domicilio",
    pago: "aprobado",
  }));
  const [mensaje, establecerMensaje] = useState(null);
  const [procesando, establecerProcesando] = useState(false);
  const bloqueado = useRef(false);
  const navegar = useNavigate();

  useTituloPagina("Checkout - Pastelería 1000 Sabores");

  const entrega = opcionesEntrega.find((opcion) => opcion.id === datos.entrega);

  function cambiarDato(evento) {
    establecerDatos((actuales) => ({
      ...actuales,
      [evento.target.name]: evento.target.value,
    }));
  }

  function comprar(evento) {
    evento.preventDefault();
    if (bloqueado.current) return;
    bloqueado.current = true;
    establecerProcesando(true);
    try {
      const resultado = confirmarCompra(datos);
      navegar(
        resultado.aprobado
          ? "/compra/" + resultado.pedido.id
          : "/compra-fallida",
      );
    } catch (error) {
      establecerMensaje(error.message);
      bloqueado.current = false;
      establecerProcesando(false);
    }
  }

  const camposFormulario = [
    {
      nombre: "nombre",
      etiqueta: "Nombre completo",
      autocompletar: "name",
      icono: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      ),
    },
    {
      nombre: "email",
      etiqueta: "Correo electrónico",
      tipo: "email",
      autocompletar: "email",
      icono: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <polyline points="22,6 12,13 2,6" />
        </svg>
      ),
    },
    {
      nombre: "direccion",
      etiqueta: "Dirección de despacho",
      autocompletar: "street-address",
      icono: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      ),
    },
    {
      nombre: "comuna",
      etiqueta: "Comuna",
      autocompletar: "address-level2",
      icono: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      ),
    },
    {
      nombre: "region",
      etiqueta: "Región",
      autocompletar: "address-level1",
      icono: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <polygon points="12 2 2 7 12 12 22 7 12 2" />
          <polyline points="2 17 12 22 22 17" />
          <polyline points="2 12 12 17 22 12" />
        </svg>
      ),
    },
  ];

  return (
    <>
      <BarraNavegacion />

      <main className={estilos.pagina}>
        {/* BANNER HERO CHECKOUT */}
        <section className={estilos.heroCheckout}>
          <div className={estilos.heroContenido}>
            <span className={estilos.subtituloBadge}>{"Compra Simulada"}</span>
            <h1 className={estilos.tituloHero}>{"Finalizar Compra"}</h1>
            <p className={estilos.bajadaHero}>
              {
                "Ingresa tus datos de despacho y selecciona tu medio de pago para completar el pedido."
              }
            </p>
          </div>
        </section>

        <div className="container py-4">
          {!carrito.length ? (
            /* ESTADO CARRITO VACÍO */
            <div className={estilos.tarjetaVacio}>
              <div className={estilos.iconoVacioWrapper}>
                <svg
                  className={estilos.iconoVacio}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
              </div>
              <h2 className={estilos.tituloVacio}>{"Tu carrito está vacío"}</h2>
              <p className={estilos.textoVacio}>
                {"No tienes productos seleccionados para finalizar una compra."}
              </p>
              <Link to="/pasteleria" className={estilos.btnExplorar}>
                {"Volver al catálogo"}
              </Link>
            </div>
          ) : (
            /* GRILLA DE FORMULARIO + RESUMEN */
            <div className="row g-4">
              {/* Columna Izquierda: Formulario de Envío */}
              <div className="col-12 col-lg-7">
                <form
                  id="form-checkout"
                  onSubmit={comprar}
                  className={estilos.tarjetaFormulario}
                >
                  <h2 className={estilos.tituloSeccionForm}>
                    {"Datos de Envío & Cliente"}
                  </h2>

                  {mensaje && (
                    <Alerta tipo="danger" className={estilos.alertaError}>
                      {mensaje}
                    </Alerta>
                  )}

                  {camposFormulario.map((campo) => (
                    <div className={estilos.grupoCampo} key={campo.nombre}>
                      <label
                        className={estilos.etiquetaFormulario}
                        htmlFor={"checkout-" + campo.nombre}
                      >
                        <span className={estilos.iconoInput}>
                          {campo.icono}
                        </span>
                        {campo.etiqueta}
                      </label>
                      <input
                        id={"checkout-" + campo.nombre}
                        name={campo.nombre}
                        type={campo.tipo || "text"}
                        autoComplete={campo.autocompletar}
                        required
                        value={datos[campo.nombre]}
                        onChange={cambiarDato}
                        className={estilos.controlFormulario}
                        placeholder={`Ingrese su ${campo.etiqueta.toLowerCase()}`}
                      />
                    </div>
                  ))}

                  {/* Opción de Entrega */}
                  <div className={estilos.grupoCampo}>
                    <label
                      className={estilos.etiquetaFormulario}
                      htmlFor="checkout-entrega"
                    >
                      <span className={estilos.iconoInput}>
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <rect x="1" y="3" width="15" height="13" />
                          <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                          <circle cx="5.5" cy="18.5" r="2.5" />
                          <circle cx="18.5" cy="18.5" r="2.5" />
                        </svg>
                      </span>
                      Opción de entrega
                    </label>
                    <select
                      id="checkout-entrega"
                      name="entrega"
                      className={estilos.controlSelect}
                      value={datos.entrega}
                      onChange={cambiarDato}
                    >
                      {opcionesEntrega.map((opcion) => (
                        <option key={opcion.id} value={opcion.id}>
                          {opcion.nombre} · {formatearPrecio(opcion.costo)}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Resultado de Pago Simulado */}
                  <div className={estilos.grupoCampo}>
                    <label
                      className={estilos.etiquetaFormulario}
                      htmlFor="checkout-pago"
                    >
                      <span className={estilos.iconoInput}>
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <rect
                            x="1"
                            y="4"
                            width="22"
                            height="16"
                            rx="2"
                            ry="2"
                          />
                          <line x1="1" y1="10" x2="23" y2="10" />
                        </svg>
                      </span>
                      Resultado del pago simulado
                    </label>
                    <select
                      id="checkout-pago"
                      name="pago"
                      className={estilos.controlSelect}
                      value={datos.pago}
                      onChange={cambiarDato}
                    >
                      <option value="aprobado">Pago aprobado</option>
                      <option value="rechazado">Pago rechazado</option>
                    </select>
                    <div className={estilos.notaDemostracion}>
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
                      </svg>
                      <span>
                        Esta compra es una demostración y no realiza cargos
                        reales.
                      </span>
                    </div>
                  </div>

                  {/* Botón de Confirmación */}
                  <button
                    type="submit"
                    className={estilos.btnConfirmar}
                    disabled={procesando}
                  >
                    {procesando ? (
                      <span>{"Procesando compra..."}</span>
                    ) : (
                      <>
                        <span>{"Confirmar compra"}</span>
                        <svg
                          className={estilos.iconoBoton}
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <line x1="5" y1="12" x2="19" y2="12" />
                          <polyline points="12 5 19 12 12 19" />
                        </svg>
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Columna Derecha: Aside Resumen de Compra */}
              <aside className="col-12 col-lg-5">
                <div className={estilos.tarjetaResumen}>
                  <h3 className={estilos.tituloResumen}>
                    {"Resumen de Compra"}
                  </h3>

                  {/* Lista desglosada de productos */}
                  <ul className={estilos.listaProductosResumen}>
                    {carrito.map((producto) => (
                      <li
                        key={producto.id}
                        className={estilos.itemProductoResumen}
                      >
                        <div className={estilos.infoProductoItem}>
                          <span className={estilos.cantidadBadge}>
                            {producto.cantidad}x
                          </span>
                          <span className={estilos.tituloProductoItem}>
                            {producto.titulo}
                          </span>
                        </div>
                        <span className={estilos.precioProductoItem}>
                          {formatearPrecio(
                            precioFinal(producto) * producto.cantidad,
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <hr className={estilos.divisorResumen} />

                  {/* Subtotales y Totales */}
                  <div className={estilos.lineaDesglose}>
                    <span>{"Productos:"}</span>
                    <span className={estilos.montoDesglose}>
                      {formatearPrecio(totalCarrito(carrito))}
                    </span>
                  </div>

                  <div className={estilos.lineaDesglose}>
                    <span>{"Entrega:"}</span>
                    <span className={estilos.montoDesglose}>
                      {formatearPrecio(entrega.costo)}
                    </span>
                  </div>

                  <div className={estilos.lineaTotalDestacada}>
                    <span>{"Total:"}</span>
                    <span
                      id="checkout-total"
                      className={estilos.montoTotalGrande}
                    >
                      {formatearPrecio(totalCarrito(carrito) + entrega.costo)}
                    </span>
                  </div>

                  {/* Enlace para revisar o editar carrito */}
                  <div className={estilos.contenedorRevisar}>
                    <Link to="/carrito" className={estilos.linkRevisarCarrito}>
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <polyline points="15 18 9 12 15 6" />
                      </svg>
                      {"Revisar o modificar carrito"}
                    </Link>
                  </div>
                </div>
              </aside>
            </div>
          )}
        </div>
      </main>

      <PiePagina />
    </>
  );
}
