import type { ConfigEnv } from "vite";
import { defineConfig, mergeConfig } from "vitest/config";
import svgr from "vite-plugin-svgr";
import { getBuildConfig } from "./vite.common.config";

export default defineConfig((env) =>
  mergeConfig(getBuildConfig(env as ConfigEnv<"build">), {
    test: {
      globals: true,
      environment: "jsdom",
      include: ["./src/**/*.{test,spec}.{ts,tsx}"],
    },
    plugins: [
      svgr({
        include: "**/*.svg",
      }),
    ],
  }),
);
