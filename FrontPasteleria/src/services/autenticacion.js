import { leerArreglo } from "../utils/almacenamiento.js";

export function obtenerUsuarioActivo() {
  const texto =
    sessionStorage.getItem("usuarioActivo") ||
    localStorage.getItem("usuarioActivo");
  try {
    return texto ? JSON.parse(texto) : null;
  } catch {
    sessionStorage.removeItem("usuarioActivo");
    localStorage.removeItem("usuarioActivo");
    return null;
  }
}

export function crearAdministradorDemo() {
  const usuarios = leerArreglo("usuariosRegistrados");
  if (
    usuarios.some(
      (usuario) => usuario && usuario.email === "admin@pasteleria.test",
    )
  )
    return;
  usuarios.push({
    nombre: "Administrador",
    apellido: "Demo",
    email: "admin@pasteleria.test",
    password: "AdminDemo123!",
    rol: "admin",
    direccion: "Dirección ficticia",
    tipoPropiedad: "Local",
    region: "metropolitana",
    comuna: "santiago",
    guardarDatos: false,
  });
  localStorage.setItem("usuariosRegistrados", JSON.stringify(usuarios));
}

// Se conservan las validaciones, mensajes y datos del JavaScript original.
export function registrarUsuario(formulario) {
  const campos = [
    "nombre",
    "apellido",
    "email",
    "password",
    "direccion",
    "tipoPropiedad",
    "region",
    "comuna",
  ];
  const usuario = Object.fromEntries(
    campos.map((clave) => [
      clave,
      clave === "password" || clave === "region"
        ? String(formulario.get(clave) ?? "")
        : String(formulario.get(clave) ?? "").trim(),
    ]),
  );
  usuario.email = usuario.email.toLowerCase();
  const errores = [];
  if (!usuario.nombre) errores.push("El nombre es obligatorio.");
  if (!usuario.apellido) errores.push("El apellido es obligatorio.");
  if (!usuario.email) errores.push("El correo es obligatorio.");
  else if (!usuario.email.includes("@") || !usuario.email.includes("."))
    errores.push("El correo debe ser válido (contener @ y un punto).");
  if (usuario.password.length < 8)
    errores.push("La contraseña debe tener al menos 8 caracteres.");
  if (!usuario.direccion) errores.push("La dirección es obligatoria.");
  if (!usuario.region) errores.push("Debes seleccionar una región.");
  if (!usuario.comuna) errores.push("La comuna es obligatoria.");
  if (errores.length) return { texto: errores, tipo: "danger" };
  const usuarios = leerArreglo("usuariosRegistrados");
  if (usuarios.some((guardado) => guardado && guardado.email === usuario.email))
    return {
      texto: "Ya existe una cuenta asociada a ese correo.",
      tipo: "danger",
      enfocar: "inputEmail",
    };
  usuarios.push({
    ...usuario,
    rol: "cliente",
    guardarDatos: formulario.has("guardarDatos"),
  });
  localStorage.setItem("usuariosRegistrados", JSON.stringify(usuarios));
  return {
    texto:
      "Registro realizado correctamente. Serás redirigido al inicio de sesión.",
    tipo: "success",
    redirigir: "/inicio-sesion",
    demora: 2500,
  };
}

export function iniciarSesion(formulario) {
  const email = String(formulario.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formulario.get("password") ?? "");
  const encontrado = leerArreglo("usuariosRegistrados").find(
    (usuario) =>
      usuario && usuario.email === email && usuario.password === password,
  );
  if (!encontrado)
    return {
      texto: "El correo o la contraseña son incorrectos.",
      tipo: "danger",
      enfocar: "inputPassword",
      limpiarContrasena: true,
    };
  const { nombre, apellido, rol, direccion, tipoPropiedad, region, comuna } =
    encontrado;
  const usuario = {
    nombre,
    apellido,
    email: encontrado.email,
    rol: rol || "cliente",
    direccion,
    tipoPropiedad,
    region,
    comuna,
  };
  sessionStorage.removeItem("usuarioActivo");
  localStorage.removeItem("usuarioActivo");
  (formulario.has("recordarCuenta") ? localStorage : sessionStorage).setItem(
    "usuarioActivo",
    JSON.stringify(usuario),
  );
  return {
    texto: `Bienvenido, ${usuario.nombre}. Ingreso correcto.`,
    tipo: "success",
    redirigir: "/perfil",
    demora: 1500,
  };
}
