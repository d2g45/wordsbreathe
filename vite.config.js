import path from "path";
import { defineConfig, loadEnv } from "vite";
import legacy from "@vitejs/plugin-legacy";
import ViteRestart from "vite-plugin-restart";
// import critical from "rollup-plugin-critical";
import viteCompression from "vite-plugin-compression";
import tsconfigPaths from "vite-tsconfig-paths";
// import webfontDownload from "vite-plugin-webfont-dl";
import { VitePWA } from "vite-plugin-pwa";

export default ({ command, mode }) => {
  // Load app-level env vars to node-level env vars.
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  // const VITE_CRITICAL_URL = process.env.VITE_CRITICAL_URL;

  return defineConfig({
    base: command === "serve" ? "" : "/dist",
    css: { preprocessorOptions: { scss: { charset: false } } },
    build: {
      // emptyOutDir: true,
      manifest: true,
      outDir: "./web/dist",
      rollupOptions: {
        input: {
          app: "./src/scripts/main.ts",
        },
      },

      commonjsOptions: {
        include: ["tailwind.config.js", "node_modules/**"],
      },
    },

    esbuild: {
      drop: mode === "production" ? ["console", "debugger"] : [],
    },

    resolve: {
      alias: {
        "@src": path.resolve(__dirname, "./src"),
      },
    },

    optimizeDeps: {
      include: ["./tailwind.config.js"],
    },

    server: {
      host: "0.0.0.0",
      port: 3000,
    },

    plugins: [
      tsconfigPaths(),
      ViteRestart({
        reload: ["./templates/**/*"],
      }),
      legacy({
        targets: ["defaults"],
      }),

      // critical({
      //     criticalUrl:
      //         VITE_CRITICAL_URL ?? "https://staging.joeydeguzman.com/",
      //     criticalBase: "./web/dist/criticalcss/",
      //     criticalPages: [
      //         { uri: "", template: "page/_entry" },
      //         { uri: "about", template: "page/_entry" },
      //         { uri: "work", template: "page/_entry" },
      //         { uri: "contact", template: "page/_entry" },
      //     ],
      //     criticalConfig: {},
      // }),

      VitePWA({
        registerType: "autoUpdate",
        devOptions: {
          enabled: true,
        },
      }),

      // webfontDownload([
      //     "https://fonts.googleapis.com/css2?family=Raleway:wght@400;600;800&display=swap",
      // ]),
      viteCompression(),
      tsconfigPaths(),
    ],
  });
};

// export default defineConfig(({ command, mode }) => ({

// }));
