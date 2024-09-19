import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'url';

// Define Vite configuration
export default defineConfig({
  server: {
    host: 'localhost',
    port: 8080,
    // Optionally enable HMR (Hot Module Replacement) for better development experience
    hmr: true,
  },
  plugins: [react()],
  resolve: {
    alias: [
      {
        find: '@',
        replacement: fileURLToPath(new URL('./src', import.meta.url)),
      },
    ],
  },
  // Enable source maps for better debugging
  build: {
    sourcemap: true,
  },
});
