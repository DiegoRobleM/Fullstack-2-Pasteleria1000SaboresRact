import { act } from "react";
import { Routes, Route } from "react-router-dom";
import {
  caso,
  entornoComponentes,
  producto,
  cliente,
  prepararCarrito,
} from "./ayudas.jsx";
import { TarjetasProductos } from "../../src/components/productos/tarjetasProductos.jsx";
import Notificacion from "../../src/components/notificacion/notificacion.jsx";
import CatalogoProductos from "../../src/components/productos/catalogoProductos.jsx";
import Carrito from "../../src/pages/carrito/carrito.jsx";
import DetalleProducto from "../../src/pages/detalleProducto/detalleProducto.jsx";
import RegistroUsuario from "../../src/pages/registroUsuario/registroUsuario.jsx";
import InicioSesion from "../../src/pages/inicioSesion/inicioSesion.jsx";
import Contacto from "../../src/pages/contacto/contacto.jsx";
import FormularioProducto from "../../src/components/administracion/FormularioProducto.jsx";
import TablaProductos from "../../src/components/administracion/TablaProductos.jsx";
import Administrador from "../../src/pages/administrador/administrador.jsx";
import PerfilUsuario from "../../src/pages/perfilUsuario/perfilUsuario.jsx";
import Checkout from "../../src/pages/checkout/checkout.jsx";
import Compra from "../../src/pages/compra/compra.jsx";
import CompraFallida from "../../src/pages/compraFallida/compraFallida.jsx";
import Categorias from "../../src/pages/categorias/categorias.jsx";
import Ofertas from "../../src/pages/ofertas/ofertas.jsx";
import App from "../../src/app/App.jsx";
describe("Componentes React: renderizado, props, estado y eventos", () => {
  const entorno = entornoComponentes();
  const contenido = () => entorno.contenedor.textContent;
  const elemento = (selector) => entorno.contenedor.querySelector(selector);
  const montarDetalle = (id) =>
    entorno.montar(
      <Routes>
        <Route path="/producto/:idProducto" element={<DetalleProducto />} />
      </Routes>,
      "/producto/" + id,
    );
  const montarCompra = () =>
    entorno.montar(
      <Routes>
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/compra/:idPedido" element={<Compra />} />
        <Route path="/compra-fallida" element={<CompraFallida />} />
      </Routes>,
      "/checkout",
    );
  caso(
    "PU-021",
    "Tarjetas renderiza los datos recibidos por props",
    "Producto Pastel de prueba, precio 10000 y descuento 20%",
    "Nombre y precio final 8000 en una tarjeta",
    async () => {
      await entorno.montar(
        <TarjetasProductos productos={[producto]} notificar={() => {}} />,
      );
      expect(contenido()).toContain(producto.titulo);
      expect(contenido()).toContain("$8.000");
      expect(entorno.contenedor.querySelectorAll(".card").length).toBe(1);
    },
  );
  caso(
    "PU-022",
    "Evento agregar ejecuta callback y actualiza el carrito",
    "Clic en Agregar al carrito; callback spy",
    "Notifica una vez y persiste el producto correcto",
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
    "PU-023",
    "Notificación usa contenido y atributos recibidos",
    "Children Consulta enviada, ID aviso y role status",
    "Contenido y atributos presentes en el DOM",
    async () => {
      await entorno.montar(
        <Notificacion id="aviso" role="status">
          Consulta enviada
        </Notificacion>,
      );
      expect(elemento("#aviso").textContent).toBe("Consulta enviada");
      expect(elemento("#aviso").getAttribute("role")).toBe("status");
    },
  );
  caso(
    "PU-024",
    "Catálogo renderiza solamente su categoría",
    "Categoría pasteleria y catálogo inicial de doce productos",
    "Tres tarjetas de pastelería",
    async () => {
      await entorno.montar(<CatalogoProductos categoria="pasteleria" />);
      expect(
        entorno.contenedor.querySelectorAll("#productos .card").length,
      ).toBe(3);
      expect(contenido()).toContain("Pastel de Chocolate");
    },
  );
  caso(
    "PU-025",
    "Búsqueda reacciona al estado del input",
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
    "PU-026",
    "Catálogo muestra el estado sin resultados",
    "Buscar un producto inexistente",
    "Mensaje visible y cero tarjetas",
    async () => {
      await entorno.montar(<CatalogoProductos categoria="pasteleria" />);
      await entorno.escribir("#buscar-productos", "inexistente");
      expect(elemento("#productos").textContent).toContain(
        "No se encontraron productos.",
      );
      expect(
        entorno.contenedor.querySelectorAll("#productos .card").length,
      ).toBe(0);
    },
  );
  caso(
    "PU-027",
    "Orden del catálogo responde al select",
    "Seleccionar menor precio",
    "Pastel de Vainilla en primer lugar",
    async () => {
      await entorno.montar(<CatalogoProductos categoria="pasteleria" />);
      await entorno.escribir("#orden-productos", "menor");
      expect(elemento("#productos h5").textContent).toBe("Pastel de Vainilla");
    },
  );
  caso(
    "PU-028",
    "Carrito vacío oculta acciones de compra",
    "Sin productos guardados",
    "Mensaje de carrito vacío y sin botón Vaciar carrito",
    async () => {
      await entorno.montar(<Carrito />);
      expect(elemento("#carrito").textContent).toContain(
        "Tu carrito está vacío",
      );
      expect(elemento("#btn-vaciar")).toBeNull();
      expect(elemento("#total").textContent).toBe("$0");
    },
  );
  caso(
    "PU-029",
    "Carrito actualiza cantidades y elimina la última unidad",
    "Dos unidades con precio final 8000; dos clics en disminuir",
    "Totales 16000, 8000 y cero; carrito vacío",
    async () => {
      prepararCarrito(2);
      await entorno.montar(<Carrito />);
      expect(elemento("#total").textContent).toBe("$16.000");
      await entorno.pulsar(entorno.boton("-"));
      expect(elemento("#total").textContent).toBe("$8.000");
      await entorno.pulsar(entorno.boton("-"));
      expect(JSON.parse(localStorage.getItem("carrito"))).toEqual([]);
    },
  );
  caso(
    "PU-030",
    "Detalle resuelve identificadores inexistentes",
    "URL /producto/no-existe",
    "Mensaje de producto no disponible",
    async () => {
      await montarDetalle("no-existe");
      expect(elemento("#mensaje-detalle").textContent).toContain("no existe");
      expect(
        elemento("#detalle-producto").classList.contains("d-none"),
      ).toBeTrue();
    },
  );
  caso(
    "PU-031",
    "Detalle usa el parámetro y añade la cantidad elegida",
    "Producto existente, cantidad 3 y clic agregar",
    "Carrito de tres unidades y notificación visible",
    async () => {
      localStorage.setItem("productosPasteleria", JSON.stringify([producto]));
      await montarDetalle(producto.id);
      await entorno.escribir("#detalle-cantidad", "3");
      await entorno.pulsar(entorno.boton("Agregar al carrito"));
      expect(JSON.parse(localStorage.getItem("carrito"))[0].cantidad).toBe(3);
      expect(getComputedStyle(elemento("#mensaje-carrito")).opacity).toBe("1");
    },
  );
  caso(
    "PU-032",
    "Detalle rechaza cantidades fraccionarias",
    "Cantidad 1.5",
    "Reinicia a una unidad, enfoca el input y no agrega",
    async () => {
      localStorage.setItem("productosPasteleria", JSON.stringify([producto]));
      await montarDetalle(producto.id);
      await entorno.escribir("#detalle-cantidad", "1.5");
      await entorno.pulsar(entorno.boton("Agregar al carrito"));
      expect(elemento("#detalle-cantidad").value).toBe("1");
      expect(document.activeElement).toBe(elemento("#detalle-cantidad"));
      expect(localStorage.getItem("carrito")).toBeNull();
    },
  );
  caso(
    "PU-033",
    "Registro muestra errores condicionalmente",
    "Formulario inicialmente vacío y luego submit",
    "Mensaje oculto al inicio; errores visibles después; sin usuario creado",
    async () => {
      await entorno.montar(<RegistroUsuario />);
      expect(
        elemento("#mensaje-registro").classList.contains("d-none"),
      ).toBeTrue();
      await entorno.enviar();
      expect(elemento("#mensaje-registro").textContent).toContain(
        "El nombre es obligatorio.",
      );
      expect(localStorage.getItem("usuariosRegistrados")).toBeNull();
    },
  );
  caso(
    "PU-034",
    "Registro guarda datos y limpia el formulario",
    "Campos válidos introducidos con eventos de input",
    "Cuenta cliente persistida y mensaje de éxito",
    async () => {
      await entorno.montar(<RegistroUsuario />);
      for (const [selector, valor] of Object.entries({
        "#nombre": cliente.nombre,
        "#apellido": cliente.apellido,
        "#inputEmail": cliente.email,
        "#inputPassword": cliente.password,
        "#inputAddress": cliente.direccion,
        "#inputAddress2": "Casa",
        "#inputState": cliente.region,
        "#inputComuna": cliente.comuna,
      }))
        await entorno.escribir(selector, valor);
      await entorno.enviar();
      expect(
        JSON.parse(localStorage.getItem("usuariosRegistrados"))[0].email,
      ).toBe(cliente.email);
      expect(elemento("#nombre").value).toBe("");
      expect(elemento("#mensaje-registro").textContent).toContain(
        "Registro realizado correctamente",
      );
    },
  );
  caso(
    "PU-035",
    "Login inválido limpia y enfoca la contraseña",
    "Correo válido y contraseña incorrecta",
    "Mensaje de error, contraseña vacía y foco en su input",
    async () => {
      localStorage.setItem("usuariosRegistrados", JSON.stringify([cliente]));
      await entorno.montar(<InicioSesion />);
      await entorno.escribir("#inputEmail", cliente.email);
      await entorno.escribir("#inputPassword", "incorrecta");
      await entorno.enviar();
      expect(elemento("#mensaje-login").textContent).toContain("incorrectos");
      expect(elemento("#inputPassword").value).toBe("");
      expect(document.activeElement).toBe(elemento("#inputPassword"));
    },
  );
  caso(
    "PU-036",
    "Login actualiza el menú de sesión inmediatamente",
    "Credenciales válidas",
    "Hola, Ana aparece y la sesión se guarda sin contraseña",
    async () => {
      localStorage.setItem("usuariosRegistrados", JSON.stringify([cliente]));
      await entorno.montar(<InicioSesion />);
      await entorno.escribir("#inputEmail", cliente.email);
      await entorno.escribir("#inputPassword", cliente.password);
      await entorno.enviar();
      expect(elemento("#nombre-usuario-navbar").textContent).toBe("Hola, Ana");
      expect(
        JSON.parse(sessionStorage.getItem("usuarioActivo")).password,
      ).toBeUndefined();
    },
  );
  caso(
    "PU-037",
    "Contacto valida, guarda y limpia sus campos",
    "Mensaje con espacios y luego consulta válida",
    "Advertencia inicial; consulta persistida y formulario vacío al éxito",
    async () => {
      await entorno.montar(<Contacto />);
      await entorno.escribir("#correo-contacto", cliente.email);
      await entorno.escribir("#consulta-contacto", "   ");
      await entorno.enviar();
      expect(elemento("#mensaje-contacto").textContent).toContain(
        "completar todos",
      );
      await entorno.escribir("#consulta-contacto", "Consulta de prueba");
      await entorno.enviar();
      expect(
        JSON.parse(localStorage.getItem("consultasContacto"))[0].mensaje,
      ).toBe("Consulta de prueba");
      expect(elemento("#correo-contacto").value).toBe("");
    },
  );
  caso(
    "PU-038",
    "Tabla de productos ejecuta callbacks recibidos por props",
    "Clic editar y eliminación confirmada; callbacks spy",
    "Editar recibe objeto; eliminar recibe ID solamente al confirmar",
    async () => {
      const editar = jasmine.createSpy("editar");
      const eliminar = jasmine.createSpy("eliminar");
      await entorno.montar(
        <TablaProductos
          productos={[producto]}
          onEditar={editar}
          onEliminar={eliminar}
        />,
      );
      await entorno.pulsar(entorno.boton("Editar"));
      expect(editar).toHaveBeenCalledOnceWith(producto);
      await entorno.pulsar(entorno.boton("Eliminar"));
      expect(eliminar).not.toHaveBeenCalled();
      await entorno.pulsar(entorno.boton("Confirmar eliminación"));
      expect(eliminar).toHaveBeenCalledOnceWith(producto.id);
    },
  );
  caso(
    "PU-039",
    "Formulario de edición precarga props y entrega cambios",
    "Producto inicial y precio modificado a 15000",
    "Callback recibe datos del formulario con nuevo precio",
    async () => {
      const guardar = jasmine.createSpy("guardar");
      await entorno.montar(
        <FormularioProducto
          producto={producto}
          onGuardar={guardar}
          onCancelar={() => {}}
        />,
      );
      expect(elemento("#producto-titulo").value).toBe(producto.titulo);
      await entorno.escribir("#producto-precio", "15000");
      await entorno.enviar();
      expect(guardar).toHaveBeenCalledTimes(1);
      expect(guardar.calls.mostRecent().args[0].precio).toBe("15000");
    },
  );
  caso(
    "PU-040",
    "Las rutas protegidas bloquean visitantes y clientes",
    "Entrar a administración sin sesión y con rol cliente",
    "Visitante va a login; cliente vuelve a Inicio",
    async () => {
      const vista = (
        <Routes>
          <Route
            path="/administrador"
            element={
              <App nombre="Administrador">
                <Administrador />
              </App>
            }
          />
          <Route path="/inicio-sesion" element={<p>Ingreso requerido</p>} />
          <Route path="/" element={<p>Inicio permitido</p>} />
        </Routes>
      );
      await entorno.montar(vista, "/administrador");
      expect(contenido()).toContain("Ingreso requerido");
      sessionStorage.setItem("usuarioActivo", JSON.stringify(cliente));
      await entorno.montar(vista, "/administrador");
      expect(contenido()).toContain("Inicio permitido");
    },
  );
  caso(
    "PU-041",
    "Checkout precarga sesión y mantiene estado de campos",
    "Cliente autenticado y dirección editada",
    "Nombre precargado y dirección nueva reflejada en el input",
    async () => {
      prepararCarrito();
      sessionStorage.setItem("usuarioActivo", JSON.stringify(cliente));
      await montarCompra();
      expect(elemento("#checkout-nombre").value).toBe("Ana Prueba");
      await entorno.escribir("#checkout-direccion", "Calle Nueva 456");
      expect(elemento("#checkout-direccion").value).toBe("Calle Nueva 456");
      expect(elemento("#checkout-total").textContent).toBe("$11.000");
    },
  );
  caso(
    "PU-042",
    "Checkout aprobado confirma y vacía el carrito",
    "Datos precargados y confirmación de compra",
    "Una orden, vista de confirmación y carrito vacío",
    async () => {
      prepararCarrito();
      sessionStorage.setItem("usuarioActivo", JSON.stringify(cliente));
      await montarCompra();
      await entorno.enviar();
      expect(contenido()).toContain("Compra confirmada");
      expect(JSON.parse(localStorage.getItem("pedidosPasteleria")).length).toBe(
        1,
      );
      expect(JSON.parse(localStorage.getItem("carrito"))).toEqual([]);
    },
  );
  caso(
    "PU-043",
    "Checkout rechazado conserva el carrito",
    "Elegir pago rechazado",
    "Vista de rechazo; carrito intacto y sin pedido",
    async () => {
      prepararCarrito();
      sessionStorage.setItem("usuarioActivo", JSON.stringify(cliente));
      await montarCompra();
      await entorno.escribir("#checkout-pago", "rechazado");
      await entorno.enviar();
      expect(contenido()).toContain("No se pudo completar el pago");
      expect(JSON.parse(localStorage.getItem("carrito")).length).toBe(1);
      expect(localStorage.getItem("pedidosPasteleria")).toBeNull();
    },
  );
  caso(
    "PU-044",
    "Perfil filtra el historial por la cuenta activa",
    "Dos pedidos con correos diferentes y usuario Ana",
    "Muestra solamente el pedido de Ana",
    async () => {
      sessionStorage.setItem("usuarioActivo", JSON.stringify(cliente));
      const base = {
        fecha: "2026-10-13T15:00:00Z",
        productos: [{ ...producto, cantidad: 1, titulo: "Pedido propio" }],
        entrega: { nombre: "Retiro" },
        total: 8000,
      };
      localStorage.setItem(
        "pedidosPasteleria",
        JSON.stringify([
          { ...base, id: "propio", correoCliente: cliente.email },
          {
            ...base,
            id: "ajeno",
            correoCliente: "otra@example.test",
            productos: [{ ...producto, cantidad: 1, titulo: "Pedido ajeno" }],
          },
        ]),
      );
      await entorno.montar(<PerfilUsuario />);
      expect(elemento("#historial-pedidos").textContent).toContain(
        "Pedido propio",
      );
      expect(elemento("#historial-pedidos").textContent).not.toContain(
        "Pedido ajeno",
      );
    },
  );
  caso(
    "PU-045",
    "Resumen de compra maneja pedidos inexistentes",
    "URL /compra/no-existe",
    "Mensaje de pedido no disponible",
    async () => {
      await entorno.montar(
        <Routes>
          <Route path="/compra/:idPedido" element={<Compra />} />
        </Routes>,
        "/compra/no-existe",
      );
      expect(contenido()).toContain("No hay un pedido disponible");
    },
  );
  caso(
    "PU-046",
    "Ofertas excluye productos sin descuento",
    "Dos productos; uno con 20% y otro con descuento cero",
    "Una sola tarjeta con precio 8000",
    async () => {
      localStorage.setItem(
        "productosPasteleria",
        JSON.stringify([producto, { ...producto, id: "otro", descuento: 0 }]),
      );
      await entorno.montar(<Ofertas />);
      expect(
        entorno.contenedor.querySelectorAll("#productos .card").length,
      ).toBe(1);
      expect(elemento("#productos").textContent).toContain("$8.000");
    },
  );
  caso(
    "PU-047",
    "Categorías renderiza el conjunto disponible",
    "Cuatro categorías y catálogo inicial",
    "Cuatro tarjetas con enlaces y tres productos por categoría",
    async () => {
      await entorno.montar(<Categorias />);
      expect(entorno.contenedor.querySelectorAll("main .card").length).toBe(4);
      expect(entorno.contenedor.querySelectorAll("main a").length).toBe(4);
      expect(contenido()).toContain("3 productos disponibles");
    },
  );
});
