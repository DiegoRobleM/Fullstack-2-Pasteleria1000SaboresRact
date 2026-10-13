export function combinarClases(...clases) {
  return clases.filter(Boolean).join(" ");
}
