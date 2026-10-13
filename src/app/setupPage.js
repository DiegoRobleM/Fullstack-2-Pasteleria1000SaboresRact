import { pages } from "./pages.js";

// Se conservan las URL .html y la navegación por páginas del sitio original.
export function setupPage() {
  if (window.location.pathname === "/" || window.location.pathname === "/index.html") {
    window.history.replaceState(null, "", "/Inicio/index.html");
  }

  const page = pages[window.location.pathname];
  if (!page) {
    window.location.replace("/Inicio/index.html");
    return null;
  }

  document.title = page.title;
  return page;
}
