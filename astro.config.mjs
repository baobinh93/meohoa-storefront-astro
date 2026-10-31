import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://meohoa.io.vn",
  output: "static",

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [sitemap()],
});