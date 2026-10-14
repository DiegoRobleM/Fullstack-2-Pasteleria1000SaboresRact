export const formatearPrecio = (valor) =>
  "$" + Number(valor).toLocaleString("es-CL");
