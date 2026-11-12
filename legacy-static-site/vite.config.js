import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 5173,
    host: true, // also reachable from your phone on the same Wi-Fi
  },
  preview: {
    port: 4173,
    host: true,
  },
  build: {
    outDir: 'dist',
  },
});
