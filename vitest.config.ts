import { defineConfig, mergeConfig } from "vitest/config";
import svgr from "vite-plugin-svgr";
import path from "path";
import { config } from "./vite.common.config";

export default mergeConfig(
  config,
  defineConfig({
    test: {
      globals: true,
      environment: "jsdom",
      include: ["./src/**/*.{test,spec}.{ts,tsx}"],
    },
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
  }),
);
