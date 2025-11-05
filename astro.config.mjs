import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  server: {
    host: true
  },
  // Add this for GitHub Pages deployment
  site: 'https://StartDowns1.github.io',
  base: '/JAYK47',
});
