import { defineConfig } from 'astro/config';
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import db from "@astrojs/db";
import vercel from '@astrojs/vercel/serverless';
import dotenv from 'dotenv';

dotenv.config();

// https://astro.build/config
export default defineConfig({
  output: 'server',
  integrations: [react(), tailwind(), db()],
  adapter: vercel(),
});
