import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";
import path from "path";

// https://vitejs.dev/config
export default defineConfig({
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
