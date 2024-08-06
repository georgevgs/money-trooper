import { defineConfig } from 'astro/config';
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import db from "@astrojs/db";
import dotenv from 'dotenv';
import netlify from "@astrojs/netlify";

dotenv.config();

export default defineConfig({
  output: 'server',
  integrations: [react(), tailwind(), db()],
  adapter: netlify()
});