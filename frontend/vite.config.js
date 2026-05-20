import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    host: '0.0.0.0',
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://nova-backend:5001',
        changeOrigin: true,
      },
      '/socket.io': {
        target: 'http://nova-backend:5001',
        ws: true,
      }
    }
  }
})
