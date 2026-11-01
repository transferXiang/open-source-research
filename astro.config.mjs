import { defineConfig } from 'astro/config';
export default defineConfig({
  site: 'https://transferXiang.github.io',
  base: '/open-source-research',
  output: 'static',
  trailingSlash: 'always',
  build: { format: 'directory' },
});
