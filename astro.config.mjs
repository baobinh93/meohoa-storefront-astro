import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://baobinh93.github.io",
  base: "/meohoa-storefront-astro",
  output: "static",

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [sitemap()],
});
