import { defineConfig } from 'astro/config';
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import db from "@astrojs/db";
import vercel from "@astrojs/vercel/serverless";

export default defineConfig({
  output: 'server',
  adapter: vercel(),
  integrations: [react(), tailwind(), db()],
});