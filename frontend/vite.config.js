import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // default port dev Vite
  },
  define: {
    'process.env': {} // supaya aman kalau ada kode yang pakai process.env
  }
})
