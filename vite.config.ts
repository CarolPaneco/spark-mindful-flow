import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { VitePWA } from "vite-plugin-pwa";
import { nitro } from "nitro/vite";
import path from "node:path";

export default defineConfig(({ command }) => ({
  plugins: [
    tanstackStart({
      server: { entry: "server" },
    }),
    {
      name: "gemini-api-dev",
      configureServer(server: any) {
        server.middlewares.use((req: any, res: any, next: any) => {
          if (req.url === "/api/health" || req.url === "/api/ping" || req.url === "/ping") {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.end(JSON.stringify({ status: "ok", timestamp: new Date().toISOString() }));
            return;
          }
          next();
        });
        server.middlewares.use("/api/gemini", async (req: any, res: any) => {
          if (req.method === "POST") {
            let raw = "";
            req.on("data", (chunk: any) => {
              raw += chunk;
            });
            req.on("end", async () => {
              try {
                const parsed = JSON.parse(raw);
                const { handleGeminiBackend } = await server.ssrLoadModule("/src/lib/gemini-server.ts");
                const result = await handleGeminiBackend(parsed);
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.setHeader("Access-Control-Allow-Origin", "*");
                res.end(JSON.stringify(result));
              } catch (err: any) {
                res.statusCode = 500;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ success: false, error: err.message }));
              }
            });
          } else if (req.method === "OPTIONS") {
            res.statusCode = 204;
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
            res.setHeader("Access-Control-Allow-Headers", "Content-Type");
            res.end();
          } else {
            res.statusCode = 405;
            res.end();
          }
        });
      },
    },
    react(),
    tailwindcss(),
    tsconfigPaths(),
    command === "build"
      ? nitro({
          defaultPreset: "node-server",
        })
      : null,
    VitePWA({
      strategies: "generateSW",
      filename: "sw.js",
      registerType: "autoUpdate",
      injectRegister: null,
      devOptions: { enabled: false },
      manifest: false,
      workbox: {
        globPatterns: ["**/*.{js,css,png,ico,svg,woff2}"],
        additionalManifestEntries: [{ url: "/", revision: "ideaflow-v1" }],
        navigateFallback: null,
        runtimeCaching: [
          {
            urlPattern: ({ request, url }) =>
              request.mode === "navigate" &&
              url.origin === self.location.origin &&
              !url.pathname.startsWith("/~oauth"),
            handler: "NetworkFirst",
            options: {
              cacheName: "ideaflow-pages",
              networkTimeoutSeconds: 5,
              precacheFallback: { fallbackURL: "/" },
              expiration: { maxEntries: 12 },
            },
          },
          {
            urlPattern: ({ url }) =>
              url.origin === self.location.origin &&
              /\/assets\/.*-[\w-]+\.(js|css|png|woff2)$/.test(url.pathname),
            handler: "CacheFirst",
            options: {
              cacheName: "ideaflow-assets",
              expiration: { maxEntries: 120, maxAgeSeconds: 2592000 },
            },
          },
        ],
      },
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: [
      "react",
      "react-dom",
      "react/jsx-runtime",
      "react/jsx-dev-runtime",
      "@tanstack/react-query",
      "@tanstack/query-core",
    ],
  },
  server: {
    host: true, // Libera o acesso pelo IP da sua rede Wi-Fi / Celular
    port: 5173,
  },
}));
