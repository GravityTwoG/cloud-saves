import { createRoot } from "react-dom/client";
import "./index.css";

const root = createRoot(document.getElementById("app"));
root.render(
  <>
    <h1>💖 Hello World!</h1>
    <p>Welcome to your Electron application.</p>
  </>
);
