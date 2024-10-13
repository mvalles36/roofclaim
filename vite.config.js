import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: './index.html',  // Ensures Rollup knows where the entry point is
      external: [],           // Add external dependencies if needed (empty for now)
     },
   },
  base: './', // This helps in resolving asset paths
});
