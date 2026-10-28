export const categorias = [
  { id: "pasteleria", nombre: "Pastelería" },
  { id: "panaderia", nombre: "Panadería" },
  { id: "salados", nombre: "Productos salados" },
  { id: "sin-azucar", nombre: "Productos sin azúcar" },
];
export function nombreCategoria(categoria) {
  return (
    categorias.find((opcion) => opcion.id === categoria)?.nombre || "Producto"
  );
}
