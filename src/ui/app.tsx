import { createRoot } from "react-dom/client";
import "./index.css";
import "./theme.css";

import { Home } from "./pages/Home";

function bootstrap() {
  const rootElement = document.getElementById("app");

  if (!rootElement) {
    alert("Failed to find the root element");
    return;
  }

  const root = createRoot(rootElement);

  root.render(<Home />);
}

bootstrap();
