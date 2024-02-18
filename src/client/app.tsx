import { createRoot } from "react-dom/client";

import "./styles/index.css";
import "./styles/theme.css";
import "./styles/utility.css";

import { ReactApplication } from "./ReactApplication";

function bootstrap() {
  const rootElement = document.getElementById("app");

  if (!rootElement) {
    alert("Failed to find the root element");
    return;
  }

  const root = createRoot(rootElement);

  root.render(<ReactApplication />);
}

bootstrap();
