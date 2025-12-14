import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    strictPort: false,
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      '192.168.1.162',
      '090180cf6f5f.ngrok-free.app',  // ngrok frontend tunnel
    ],
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        rewrite: (path) => path
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'chart-vendor': ['recharts'],
          'ui-vendor': ['bootstrap', 'react-bootstrap', 'lucide-react']
        }
      }
    }
  },
  preview: {
    port: 3000,
    strictPort: false
  }
})
