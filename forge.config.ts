import fs from "fs/promises";

import type { ForgeConfig } from "@electron-forge/shared-types";
import { MakerSquirrel } from "@electron-forge/maker-squirrel";
import { VitePlugin } from "@electron-forge/plugin-vite";

const config: ForgeConfig = {
  packagerConfig: {
    name: "Cloud Saves",
    protocols: [
      {
        name: "Cloud Saves",
        schemes: ["cloud-saves"],
      },
    ],
    icon: "assets/electron-icon_16x16",
  },
  hooks: {
    // remove localization files that are not used
    postPackage: async (_, buildPath) => {
      for (const outputPath of buildPath.outputPaths) {
        const localeDir = outputPath + "/locales/";
        const files = await fs.readdir(localeDir);
        if (!(files && files.length)) return;

        for (let i = 0, len = files.length; i < len; i++) {
          const match = files[i].match(/en-US\.pak/);
          if (match === null) {
            await fs.unlink(localeDir + files[i]);
          }
        }
      }
    },
  },
  rebuildConfig: {},
  makers: [new MakerSquirrel({})],
  plugins: [
    new VitePlugin({
      // `build` can specify multiple entry builds, which can be Main process, Preload scripts, Worker process, etc.
      // If you are familiar with Vite configuration, it will look really familiar.
      build: [
        {
          // `entry` is just an alias for `build.lib.entry` in the corresponding file of `config`.
          entry: "src/main.ts",
          config: "vite.main.config.ts",
        },
        {
          entry: "src/preload.ts",
          config: "vite.preload.config.ts",
        },
      ],
      renderer: [
        {
          name: "main_window",
          config: "vite.renderer.config.ts",
        },
      ],
    }),
  ],
};

export default config;
