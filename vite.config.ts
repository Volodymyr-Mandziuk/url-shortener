import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/url-shortener/',
  plugins: [react()],
  server: {
    open: true
  },
  build: {
    outDir: "../portfolio-main/dist/url-shortener",
    emptyOutDir: true
  }
})
