import { defineConfig } from 'astro/config';
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import db from "@astrojs/db";
import netlify from "@astrojs/netlify";

export default defineConfig({
  output: 'server',
  integrations: [react(), tailwind(), db()],
  adapter: netlify()
});