import { defineConfig } from 'vite';

// Keep URLs like /public/css/... working (same as GitHub Pages). Default
// Vite maps public/ to /, which would break those paths.
export default defineConfig({
  publicDir: false,
});
