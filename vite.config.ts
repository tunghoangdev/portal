import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";
import { MENU_SETTINGS } from "./src/constant/site-menu";

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  // Load env file based on `mode`.
  const env = loadEnv(mode, process.cwd(), "");

  // Determine intended environment:
  // Determine intended environment:
  // 1. From process.env (passed from command line)
  // 2. From loaded .env file
  // 3. Fallback to mode
  const appEnv = process.env.VITE_APP_ENV || env.VITE_APP_ENV || mode;

  // Persist for sub-processes/prerender
  if (appEnv && !process.env.VITE_APP_ENV) {
    process.env.VITE_APP_ENV = appEnv;
  }

  const isProd = appEnv === "prod";
  const isBeta = appEnv === "beta";
  const isDevelopment = appEnv === "development" || appEnv === "production";

  // Build directly to environment folder at root level
  let outDir = appEnv;
  if (isDevelopment) outDir = "dist";
  if (isProd) outDir = "prod";

  console.log(`🔧 Building for: ${appEnv.toUpperCase()} (mode: ${mode})`);
  console.log(`📦 API URL: ${env.VITE_API_URL || "Using default"}`);
  console.log(`📁 Output Directory: ${outDir}/`);
  const pages = () => {
    const staticRoutes = new Set<string>(["/login", "/register"]);
    const traverse = (items: any[]) => {
      items?.forEach((item) => {
        if (item.url) staticRoutes.add(item.url);
        if (item.children?.length) traverse(item.children);
      });
    };
    Object.values(MENU_SETTINGS).forEach((items) => traverse(items));
    let newPages: { path: string; prerender: { enabled: boolean; outputPath: string; }; }[] =[]
    Array.from(staticRoutes).forEach((route) => {
      newPages.push({
        path: route,
        prerender: { enabled: true, outputPath: `${route}.html` },
      });
    });
    return newPages;
  };
 

  return {
    server: {
      port: 3005,
    },
    build: {
      // Each environment builds to its own folder at root level
      outDir,
      // Optimize build based on environment
      minify: isProd || isBeta ? "esbuild" : false,
      sourcemap: isDevelopment || isBeta,
      // Increase chunk size warning limit for production
      chunkSizeWarningLimit: isProd ? 1000 : 500,
      // Empty outDir before building
      emptyOutDir: true,
    },
    plugins: [
      tailwindcss(),
      tsConfigPaths({
        projects: ["./tsconfig.json"],
      }),
      tanstackStart({
        spa: {
          enabled: true,
          prerender: {
            crawlLinks: true,
            autoSubfolderIndex: false,
          },
        },
        prerender: {
          failOnError: false,
        },
        router: {
          routesDirectory: "app", // Defaults to "routes", relative to srcDirectory
        },
        // sitemap: {
        //   host: isProduction
        //     ? env.VITE_API_URL?.replace('/api', '') || "https://example.com"
        //     : isBeta
        //     ? "https://beta.example.com"
        //     : "https://localhost:3005",
        // },
      pages: pages(),
      }),
      viteReact(),
    ],
    define: {
      // Make env variables available in the app
      __APP_ENV__: JSON.stringify(mode),
    },
  };
});
