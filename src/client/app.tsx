import { createRoot } from "react-dom/client";

import "./styles/index.css";
import "./styles/theme.css";
import "./styles/utility.css";

import { Wrapper } from "./Wrapper";

function bootstrap() {
  const rootElement = document.getElementById("app");

  if (!rootElement) {
    alert("Failed to find the root element");
    return;
  }

  const root = createRoot(rootElement);

  root.render(<Wrapper />);
}

bootstrap();
