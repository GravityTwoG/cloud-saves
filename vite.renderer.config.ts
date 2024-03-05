import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";
import path from "path";
import { config } from "./vite.common.config";

// https://vitejs.dev/config
export default defineConfig({
  ...config,
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  plugins: [
    svgr({
      include: "**/*.svg",
    }),
  ],
});
