import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const rootDir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  envDir: path.resolve(rootDir, '../..'),
  resolve: {
    alias: {
      '@dof-update/contracts': path.resolve(rootDir, '../../packages/contracts/src/index.ts')
    }
  },
  server: {
    host: '127.0.0.1',
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:3001',
        changeOrigin: true
      },
      '/health': {
        target: 'http://127.0.0.1:3001',
        changeOrigin: true
      },
      '/webhooks': {
        target: 'http://127.0.0.1:3001',
        changeOrigin: true
      }
    }
  }
});
