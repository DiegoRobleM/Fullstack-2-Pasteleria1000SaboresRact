import { createRoot } from "react-dom/client";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import App from "./app/App.jsx";
import { setupPage } from "./app/setupPage.js";
import { StoreProvider } from "./context/StoreContext.jsx";

const page = setupPage();
if (page) {
  // Montar sobre body mantiene body > main y los custom tags del CSS original.
  createRoot(document.body).render(
    <StoreProvider>
      <App page={page} />
    </StoreProvider>,
  );
}
