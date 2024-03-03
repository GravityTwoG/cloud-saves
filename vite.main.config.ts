import { defineConfig } from "vite";
import path from "path";
import { config } from "./vite.common.config";

// https://vitejs.dev/config
export default defineConfig({
  ...config,
  resolve: {
    // Some libs that can run in both Web and Node.js, such as `axios`, we need to tell Vite to build them in Node.js.
    mainFields: ["module", "jsnext:main", "jsnext"],
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  publicDir: "assets",
  envDir: ".",
});
