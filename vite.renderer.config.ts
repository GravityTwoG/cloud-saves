import { ConfigEnv, UserConfig, mergeConfig } from "vite";
import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";
import { getBuildConfig, pluginExposeRenderer } from "./vite.common.config";

// https://vitejs.dev/config
export default defineConfig((env) => {
  const forgeEnv = env as ConfigEnv<"renderer">;
  const { root, mode, forgeConfigSelf } = forgeEnv;
  const name = forgeConfigSelf.name ?? "";

  return mergeConfig(getBuildConfig(env as ConfigEnv<"build">), {
    root,
    mode,
    base: "./",
    build: {
      outDir: `.vite/renderer/${name}`,
    },
    plugins: [
      pluginExposeRenderer(name),
      svgr({
        include: "**/*.svg",
      }),
    ],
    resolve: {
      preserveSymlinks: true,
    },
    clearScreen: false,
  } as UserConfig);
});
