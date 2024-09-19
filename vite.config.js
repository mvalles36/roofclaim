import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'url';

export default defineConfig({
  server: {
    host: 'localhost',
    port: 8080,
    hmr: {
      // Enable HMR
      clientPort: 3000, // Specify the port for HMR client (if different from server port)
      overlay: true,    // Show error overlay in the browser
    },
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
  build: {
    sourcemap: true,
  },
});
