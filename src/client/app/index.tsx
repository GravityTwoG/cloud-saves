import { createRoot } from "react-dom/client";

import "@/client/ui/styles/theme.css";
import "./styles/utility.css";

import { initI18n } from "@/client/locales";
import { ReactApplication } from "./ReactApplication";

function bootstrap() {
  initI18n();

  const rootElement = document.getElementById("app");

  if (!rootElement) {
    alert("Failed to find the root element");
    return;
  }

  const root = createRoot(rootElement);

  root.render(<ReactApplication />);
}

bootstrap();
