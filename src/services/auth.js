import { readArray } from "../utils/storage.js";

export function activeUser() {
  const text =
    sessionStorage.getItem("usuarioActivo") ||
    localStorage.getItem("usuarioActivo");
  try {
    return text ? JSON.parse(text) : null;
  } catch {
    sessionStorage.removeItem("usuarioActivo");
    localStorage.removeItem("usuarioActivo");
    return null;
  }
}

export function createDemoAdministrator() {
  const users = readArray("usuariosRegistrados");
  if (users.some((user) => user && user.email === "admin@pasteleria.test"))
    return;
  users.push({
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
  localStorage.setItem("usuariosRegistrados", JSON.stringify(users));
}

// Se conservan las validaciones, mensajes y datos del JavaScript original.
export function register(form) {
  const fields = [
    "nombre",
    "apellido",
    "email",
    "password",
    "direccion",
    "tipoPropiedad",
    "region",
    "comuna",
  ];
  const user = Object.fromEntries(
    fields.map((key) => [
      key,
      key === "password" || key === "region"
        ? form.get(key)
        : form.get(key).trim(),
    ]),
  );
  user.email = user.email.toLowerCase();
  const errors = [];
  if (!user.nombre) errors.push("El nombre es obligatorio.");
  if (!user.apellido) errors.push("El apellido es obligatorio.");
  if (!user.email) errors.push("El correo es obligatorio.");
  else if (!user.email.includes("@") || !user.email.includes("."))
    errors.push("El correo debe ser válido (contener @ y un punto).");
  if (user.password.length < 8)
    errors.push("La contraseña debe tener al menos 8 caracteres.");
  if (!user.direccion) errors.push("La dirección es obligatoria.");
  if (!user.region) errors.push("Debes seleccionar una región.");
  if (!user.comuna) errors.push("La comuna es obligatoria.");
  if (errors.length) return { text: errors, type: "danger" };
  const users = readArray("usuariosRegistrados");
  if (users.some((saved) => saved && saved.email === user.email))
    return {
      text: "Ya existe una cuenta asociada a ese correo.",
      type: "danger",
      focus: "inputEmail",
    };
  users.push({
    ...user,
    rol: "cliente",
    guardarDatos: form.has("guardarDatos"),
  });
  localStorage.setItem("usuariosRegistrados", JSON.stringify(users));
  return {
    text: "Registro realizado correctamente. Serás redirigido al inicio de sesión.",
    type: "success",
    redirect: "../InicioSesion/iniciosesion.html",
    delay: 2500,
  };
}

export function login(form) {
  const email = form.get("email").trim().toLowerCase();
  const password = form.get("password");
  const found = readArray("usuariosRegistrados").find(
    (user) => user && user.email === email && user.password === password,
  );
  if (!found)
    return {
      text: "El correo o la contraseña son incorrectos.",
      type: "danger",
      focus: "inputPassword",
      clearPassword: true,
    };
  const { nombre, apellido, rol, direccion, tipoPropiedad, region, comuna } =
    found;
  const user = {
    nombre,
    apellido,
    email: found.email,
    rol: rol || "cliente",
    direccion,
    tipoPropiedad,
    region,
    comuna,
  };
  sessionStorage.removeItem("usuarioActivo");
  localStorage.removeItem("usuarioActivo");
  (form.has("recordarCuenta") ? localStorage : sessionStorage).setItem(
    "usuarioActivo",
    JSON.stringify(user),
  );
  return {
    text: `Bienvenido, ${user.nombre}. Ingreso correcto.`,
    type: "success",
    redirect: "../PerfilUsuario/index.html",
    delay: 1500,
  };
}
