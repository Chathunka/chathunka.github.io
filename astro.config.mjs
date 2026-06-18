import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://edgeintellab.com",
  output: "static",
  trailingSlash: "never",
  integrations: [
    sitemap({
      filter: (page) => !page.includes("/chathunka"),
    }),
  ],
  markdown: {
    shikiConfig: {
      theme: "github-dark",
    },
  },
});
