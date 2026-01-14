import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { defineConfig } from "vite"; // Use Vite's defineConfig
import tsConfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
export default defineConfig({
  server: {
    port: 3000,
  },
  plugins: [
    tsConfigPaths({
      projects: ["./tsconfig.json"],
    }),
    tanstackStart({
      prerender: {
        // Enable prerendering
        enabled: true,

        // // Enable if you need pages to be at `/page/index.html` instead of `/page.html`
        // autoSubfolderIndex: true,

        // If disabled, only the root path or the paths defined in the pages config will be prerendered
        // autoStaticPathsDiscovery: true,

        // How many prerender jobs to run at once
        concurrency: 14,

        // Whether to extract links from the HTML and prerender them also
        crawlLinks: true,

        // Filter function takes the page object and returns whether it should prerender
        filter: ({ path }) => !path.startsWith("/do-not-render-me"),

        // Number of times to retry a failed prerender job
        retryCount: 2,

        // Delay between retries in milliseconds
        retryDelay: 1000,

        // Maximum number of redirects to follow during prerendering
        maxRedirects: 5,

        // Fail if an error occurs during prerendering
        failOnError: true,

        // Callback when page is successfully rendered
        onSuccess: ({ page }) => {
          console.log(`Rendered ${page.path}!`);
        },
      },
    }),
    viteReact(),
    tailwindcss(),
    // nitro(),
  ],
});
