import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: resolve(__dirname, 'src/main.jsx'), // Set the main entry point
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'), // Optional alias
    },
  },
  server: {
    port: 8080, // Port configuration
  },
});
