import { createRef } from "react";
import { caso, entornoComponentes, producto } from "./ayudas.jsx";
import Alerta from "../../src/components/alerta/alerta.jsx";
import AlertaFormulario from "../../src/components/alerta/alertaFormulario.jsx";
import Notificacion from "../../src/components/notificacion/notificacion.jsx";
import { TarjetasProductos } from "../../src/components/productos/tarjetasProductos.jsx";
import CatalogoProductos from "../../src/components/productos/catalogoProductos.jsx";
import { FilasCarrito } from "../../src/components/carrito/filasCarrito.jsx";
import FormularioProducto from "../../src/components/administracion/FormularioProducto.jsx";

describe("Diez pruebas unitarias simples de componentes", () => {
  const entorno = entornoComponentes();
  const elemento = (selector) => entorno.contenedor.querySelector(selector);

  caso(
    "PU-001",
    "Alerta muestra un mensaje de éxito",
    "Texto Guardado y tipo success",
    "Texto, color success y role status",
    async () => {
      await entorno.montar(
        <Alerta id="aviso" tipo="success">
          Guardado
        </Alerta>,
      );
      expect(elemento("#aviso").textContent).toBe("Guardado");
      expect(elemento("#aviso").classList.contains("alert-success")).toBeTrue();
      expect(elemento("#aviso").getAttribute("role")).toBe("status");
    },
  );

  caso(
    "PU-002",
    "Alerta permite ocultar y mostrar el contenido",
    "visible false y luego true",
    "Oculta al inicio y visible después",
    async () => {
      await entorno.montar(<Alerta visible={false}>Aviso</Alerta>);
      expect(elemento(".alert").classList.contains("d-none")).toBeTrue();
      await entorno.montar(<Alerta>Aviso</Alerta>);
      expect(elemento(".alert").classList.contains("d-none")).toBeFalse();
    },
  );

  caso(
    "PU-003",
    "AlertaFormulario se oculta sin mensaje",
    "mensaje null",
    "Alerta vacía y oculta",
    async () => {
      await entorno.montar(<AlertaFormulario mensaje={null} />);
      expect(elemento(".alert").textContent).toBe("");
      expect(elemento(".alert").classList.contains("d-none")).toBeTrue();
    },
  );

  caso(
    "PU-004",
    "AlertaFormulario muestra varios errores",
    "Dos errores y una referencia React",
    "Dos textos separados por br, role alert y ref al elemento",
    async () => {
      const referencia = createRef();
      await entorno.montar(
        <AlertaFormulario
          ref={referencia}
          mensaje={{ tipo: "danger", texto: ["Falta nombre", "Falta correo"] }}
        />,
      );
      expect(elemento(".alert").textContent).toContain("Falta nombre");
      expect(elemento(".alert").textContent).toContain("Falta correo");
      expect(elemento(".alert br")).not.toBeNull();
      expect(elemento(".alert").getAttribute("role")).toBe("alert");
      expect(referencia.current).toBe(elemento(".alert"));
    },
  );

  caso(
    "PU-005",
    "Notificacion recibe su contenido",
    "Texto Producto agregado",
    "Texto recibido y role status",
    async () => {
      await entorno.montar(
        <Notificacion id="notificacion">Producto agregado</Notificacion>,
      );
      expect(elemento("#notificacion").textContent).toBe("Producto agregado");
      expect(elemento("#notificacion").getAttribute("role")).toBe("status");
    },
  );

  caso(
    "PU-006",
    "Tarjetas muestra el producto y su descuento",
    "Producto de 10000 con descuento 20%",
    "Nombre y precio final 8000",
    async () => {
      await entorno.montar(
        <TarjetasProductos productos={[producto]} notificar={() => {}} />,
      );
      expect(elemento(".card").textContent).toContain("Pastel de prueba");
      expect(elemento(".card").textContent).toContain("$8.000");
    },
  );

  caso(
    "PU-007",
    "Agregar al carrito llama a la notificación",
    "Clic Agregar al carrito y callback spy",
    "Una llamada y producto guardado",
    async () => {
      const notificar = jasmine.createSpy("notificar");
      await entorno.montar(
        <TarjetasProductos productos={[producto]} notificar={notificar} />,
      );
      await entorno.pulsar(entorno.boton("Agregar al carrito"));
      expect(notificar).toHaveBeenCalledTimes(1);
      expect(JSON.parse(localStorage.getItem("carrito"))[0].id).toBe(
        producto.id,
      );
    },
  );

  caso(
    "PU-008",
    "La búsqueda filtra el catálogo",
    "Escribir FRUTILLA",
    "Una tarjeta de Pastel de Frutilla",
    async () => {
      await entorno.montar(<CatalogoProductos categoria="pasteleria" />);
      await entorno.escribir("#buscar-productos", "FRUTILLA");
      expect(
        entorno.contenedor.querySelectorAll("#productos .card").length,
      ).toBe(1);
      expect(elemento("#productos h5").textContent).toBe("Pastel de Frutilla");
    },
  );

  caso(
    "PU-009",
    "El carrito vacío muestra una alerta",
    "Carrito sin productos",
    "Mensaje informativo de carrito vacío",
    async () => {
      await entorno.montar(<FilasCarrito />);
      expect(elemento(".alert-info").textContent).toContain(
        "Tu carrito está vacío",
      );
    },
  );

  caso(
    "PU-010",
    "FormularioProducto entrega el precio editado",
    "Producto recibido por props y precio 15000",
    "Nombre precargado y callback con precio 15000",
    async () => {
      const guardar = jasmine.createSpy("guardar");
      await entorno.montar(
        <FormularioProducto
          producto={producto}
          onGuardar={guardar}
          onCancelar={() => {}}
        />,
      );
      expect(elemento("#producto-titulo").value).toBe("Pastel de prueba");
      await entorno.escribir("#producto-precio", "15000");
      await entorno.enviar();
      expect(guardar).toHaveBeenCalledTimes(1);
      expect(guardar.calls.mostRecent().args[0].precio).toBe("15000");
      expect(elemento(".alert-success").textContent).toContain(
        "Producto actualizado",
      );
    },
  );
});
