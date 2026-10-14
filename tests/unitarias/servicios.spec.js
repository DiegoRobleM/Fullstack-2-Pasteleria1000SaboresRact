import {
  caso,
  datosFormulario,
  producto,
  cliente,
  datosCompra,
} from "./ayudas.jsx";
import { leerArreglo } from "../../src/utils/almacenamiento.js";
import { precioFinal, totalCarrito } from "../../src/utils/precios.js";
import {
  normalizarCarrito,
  agregarAlCarrito,
  cambiarCantidadCarrito,
} from "../../src/services/carrito.js";
import {
  obtenerProductos,
  crearProducto,
  editarProducto,
  eliminarProducto,
} from "../../src/services/productos.js";
import {
  crearAdministradorDemo,
  registrarUsuario,
  iniciarSesion,
  obtenerUsuarioActivo,
} from "../../src/services/autenticacion.js";
import {
  registrarConsulta,
  cambiarEstadoConsulta,
} from "../../src/services/consultas.js";
import {
  crearPedido,
  obtenerPedidos,
  pedidosDelUsuario,
} from "../../src/services/pedidos.js";
describe("Servicios y reglas de la tienda", () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  caso(
    "PU-001",
    "Recupera almacenamiento inválido",
    "JSON corrupto y objeto en una clave de arreglo",
    "Devuelve [] sin lanzar errores",
    () => {
      localStorage.setItem("prueba", "corrupto");
      expect(leerArreglo("prueba")).toEqual([]);
      localStorage.setItem("prueba", "{}");
      expect(leerArreglo("prueba")).toEqual([]);
    },
  );
  caso(
    "PU-002",
    "Normaliza carrito con el catálogo vigente",
    "Cantidad 2, precio alterado y producto inexistente",
    "Conserva el producto disponible, cantidad 2 y precio de catálogo",
    () => {
      const datos = [
        { id: producto.id, precio: 1, cantidad: 2 },
        { id: "no-existe", cantidad: 1 },
        { id: producto.id, cantidad: -2 },
      ];
      expect(normalizarCarrito(datos, [producto])).toEqual([
        { ...producto, cantidad: 2 },
      ]);
    },
  );
  caso(
    "PU-003",
    "Acumula productos sin mutar el carrito anterior",
    "Una unidad existente y tres añadidas",
    "Una fila con cuatro unidades; entrada original intacta",
    () => {
      const anterior = [{ ...producto, cantidad: 1 }];
      const nuevo = agregarAlCarrito(anterior, producto, 3);
      expect(nuevo[0].cantidad).toBe(4);
      expect(nuevo.length).toBe(1);
      expect(anterior[0].cantidad).toBe(1);
    },
  );
  caso(
    "PU-004",
    "Rechaza cantidades inválidas",
    "Cero, fracción y NaN",
    "Lanza error y no agrega productos",
    () => {
      for (const cantidad of [0, 1.5, NaN])
        expect(() => agregarAlCarrito([], producto, cantidad)).toThrowError(
          /cantidad/,
        );
    },
  );
  caso(
    "PU-005",
    "Quita el producto al disminuir su última unidad",
    "Carrito con una unidad; variación -1",
    "Carrito vacío",
    () => {
      expect(
        cambiarCantidadCarrito([{ ...producto, cantidad: 1 }], producto.id, -1),
      ).toEqual([]);
    },
  );
  caso(
    "PU-006",
    "Calcula descuentos y totales en pesos enteros",
    "Precio 10000, descuento 20%, cantidad 2; descuento 100%",
    "Precio 8000, total 16000 y precio cero al 100%",
    () => {
      expect(precioFinal(producto)).toBe(8000);
      expect(totalCarrito([{ ...producto, cantidad: 2 }])).toBe(16000);
      expect(precioFinal({ ...producto, descuento: 100 })).toBe(0);
      expect(precioFinal({ precio: 101, descuento: 25 })).toBe(76);
    },
  );
  caso(
    "PU-007",
    "Completa CRUD sin cambiar el identificador al editar",
    "Crear, editar categoría a salados y eliminar",
    "Persistencia actualizada; ID estable; producto eliminado",
    () => {
      localStorage.setItem("productosPasteleria", "[]");
      const creado = crearProducto(producto);
      const editado = editarProducto(creado.id, {
        ...creado,
        categoria: "salados",
        precio: 5000,
      });
      expect(editado.id).toBe(creado.id);
      expect(obtenerProductos()[0].categoria).toBe("salados");
      eliminarProducto(creado.id);
      expect(obtenerProductos()).toEqual([]);
    },
  );
  caso(
    "PU-008",
    "Valida datos e identificadores en administración",
    "Precio negativo, descuento 101 e ID desconocido",
    "Errores sin sobrescribir datos",
    () => {
      expect(() => crearProducto({ ...producto, precio: -1 })).toThrowError(
        /precio/,
      );
      expect(() => crearProducto({ ...producto, descuento: 101 })).toThrowError(
        /descuento/,
      );
      expect(() => editarProducto("no-existe", producto)).toThrowError(
        /no encontrado/,
      );
      expect(() => eliminarProducto("no-existe")).toThrowError(/no encontrado/);
      expect(localStorage.getItem("productosPasteleria")).toBeNull();
    },
  );
  caso(
    "PU-009",
    "Valida un registro vacío",
    "Formulario sin campos",
    "Lista de errores; no crea usuario",
    () => {
      const resultado = registrarUsuario(new FormData());
      expect(resultado.tipo).toBe("danger");
      expect(resultado.texto).toContain("El nombre es obligatorio.");
      expect(localStorage.getItem("usuariosRegistrados")).toBeNull();
    },
  );
  caso(
    "PU-010",
    "Normaliza correo y evita registros duplicados",
    "Correo ANA@example.test y rol admin enviado por el cliente",
    "Correo en minúsculas, rol cliente y segundo registro rechazado",
    () => {
      const datos = datosFormulario({
        ...cliente,
        email: "ANA@example.test",
        rol: "admin",
      });
      expect(registrarUsuario(datos).tipo).toBe("success");
      expect(leerArreglo("usuariosRegistrados")[0].rol).toBe("cliente");
      expect(registrarUsuario(datos).tipo).toBe("danger");
    },
  );
  caso(
    "PU-011",
    "Rechaza credenciales incorrectas",
    "Usuario registrado y contraseña incorrecta",
    "Error; sesión inexistente; solicita limpiar contraseña",
    () => {
      registrarUsuario(datosFormulario(cliente));
      const resultado = iniciarSesion(
        datosFormulario({ email: cliente.email, password: "Incorrecta" }),
      );
      expect(resultado.tipo).toBe("danger");
      expect(resultado.limpiarContrasena).toBeTrue();
      expect(obtenerUsuarioActivo()).toBeNull();
    },
  );
  caso(
    "PU-012",
    "Guarda sesión temporal sin contraseña",
    "Login válido sin recordar cuenta",
    "sessionStorage contiene usuario; localStorage no; sin password",
    () => {
      registrarUsuario(datosFormulario(cliente));
      iniciarSesion(datosFormulario(cliente));
      expect(
        JSON.parse(sessionStorage.getItem("usuarioActivo")).password,
      ).toBeUndefined();
      expect(localStorage.getItem("usuarioActivo")).toBeNull();
    },
  );
  caso(
    "PU-013",
    "Guarda la cuenta recordada y recupera sesión corrupta",
    "Login con recordarCuenta; luego JSON corrupto",
    "Sesión en localStorage; dato inválido se limpia",
    () => {
      registrarUsuario(datosFormulario(cliente));
      iniciarSesion(datosFormulario({ ...cliente, recordarCuenta: "true" }));
      expect(JSON.parse(localStorage.getItem("usuarioActivo")).email).toBe(
        cliente.email,
      );
      expect(sessionStorage.getItem("usuarioActivo")).toBeNull();
      localStorage.setItem("usuarioActivo", "corrupto");
      expect(obtenerUsuarioActivo()).toBeNull();
      expect(localStorage.getItem("usuarioActivo")).toBeNull();
    },
  );
  caso(
    "PU-014",
    "Crea administrador demo sin duplicados",
    "Dos inicializaciones del administrador",
    "Una sola cuenta con rol admin",
    () => {
      crearAdministradorDemo();
      crearAdministradorDemo();
      expect(leerArreglo("usuariosRegistrados").length).toBe(1);
      expect(leerArreglo("usuariosRegistrados")[0].rol).toBe("admin");
    },
  );
  caso(
    "PU-015",
    "Normaliza consultas y actualiza su estado",
    "Correo en mayúsculas y consulta con espacios",
    "Datos recortados, estado pendiente y posterior resuelta",
    () => {
      registrarConsulta(
        datosFormulario({
          correo: " ANA@example.test ",
          mensaje: " Consulta ",
        }),
      );
      const consulta = leerArreglo("consultasContacto")[0];
      expect(consulta.correo).toBe(cliente.email);
      expect(consulta.mensaje).toBe("Consulta");
      expect(cambiarEstadoConsulta(consulta.id, "resuelta")[0].estado).toBe(
        "resuelta",
      );
      expect(() =>
        cambiarEstadoConsulta(consulta.id, "invalido"),
      ).toThrowError();
    },
  );
  caso(
    "PU-016",
    "No guarda consultas vacías",
    "Mensaje compuesto por espacios",
    "Advertencia y almacenamiento sin consultas",
    () => {
      expect(
        registrarConsulta(
          datosFormulario({ correo: cliente.email, mensaje: "   " }),
        ).tipo,
      ).toBe("warning");
      expect(localStorage.getItem("consultasContacto")).toBeNull();
    },
  );
  caso(
    "PU-017",
    "Registra total, entrega y precios pagados",
    "Dos unidades de 10000 con 20% de descuento y despacho de 3000",
    "Subtotal 16000; total 19000; snapshot de precio final 8000",
    () => {
      const resultado = crearPedido({
        carrito: [{ ...producto, precio: 1, cantidad: 2 }],
        productos: [producto],
        datos: datosCompra,
        usuario: cliente,
      });
      expect(resultado.pedido.subtotal).toBe(16000);
      expect(resultado.pedido.total).toBe(19000);
      expect(resultado.pedido.productos[0].precioFinal).toBe(8000);
      expect(obtenerPedidos().length).toBe(1);
      producto.precio = 12000;
      expect(obtenerPedidos()[0].productos[0].precioFinal).toBe(8000);
      producto.precio = 10000;
    },
  );
  caso(
    "PU-018",
    "Pago rechazado no crea pedido",
    "Carrito válido y pago rechazado",
    "Resultado aprobado false; pedidos sin cambios",
    () => {
      const resultado = crearPedido({
        carrito: [{ ...producto, cantidad: 1 }],
        productos: [producto],
        datos: { ...datosCompra, pago: "rechazado" },
      });
      expect(resultado.aprobado).toBeFalse();
      expect(obtenerPedidos()).toEqual([]);
    },
  );
  caso(
    "PU-019",
    "Rechaza compras vacías o con datos inválidos",
    "Carrito vacío, email inválido y producto eliminado",
    "Lanza errores; no persiste pedidos",
    () => {
      const base = {
        carrito: [{ ...producto, cantidad: 1 }],
        productos: [producto],
        datos: datosCompra,
      };
      expect(() => crearPedido({ ...base, carrito: [] })).toThrowError(
        /carrito/,
      );
      expect(() =>
        crearPedido({ ...base, datos: { ...datosCompra, email: "invalido" } }),
      ).toThrowError(/correo/);
      expect(() => crearPedido({ ...base, productos: [] })).toThrowError(
        /disponibles/,
      );
      expect(obtenerPedidos()).toEqual([]);
    },
  );
  caso(
    "PU-020",
    "Historial muestra pedidos del usuario correspondiente",
    "Pedidos de Ana y de otra persona",
    "Cada historial contiene solamente su pedido",
    () => {
      crearPedido({
        carrito: [{ ...producto, cantidad: 1 }],
        productos: [producto],
        datos: datosCompra,
        usuario: cliente,
      });
      crearPedido({
        carrito: [{ ...producto, cantidad: 1 }],
        productos: [producto],
        datos: {
          ...datosCompra,
          email: "otra@example.test",
          entrega: "retiro",
        },
      });
      expect(pedidosDelUsuario(cliente).length).toBe(1);
      expect(
        pedidosDelUsuario({ email: "otra@example.test" })[0].entrega.costo,
      ).toBe(0);
      expect(pedidosDelUsuario(null)).toEqual([]);
    },
  );
});
