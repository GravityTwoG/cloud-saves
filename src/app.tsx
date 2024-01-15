import { createRoot } from "react-dom/client";
import "./index.css";
import "./theme.css";
import { Button } from "./ui/components/atoms/Button/Button";

function bootstrap() {
  const rootElement = document.getElementById("app");

  if (!rootElement) {
    alert("Failed to find the root element");
    return;
  }

  const root = createRoot(rootElement);

  root.render(
    <>
      <h1>💖 Hello World!</h1>
      <p>Welcome to your Electron application.</p>
      <Button>Button</Button>
      <Button isLoading>Button</Button>
    </>
  );
}

bootstrap();
