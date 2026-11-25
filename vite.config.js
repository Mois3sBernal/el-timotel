import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// base './' hace que el sitio funcione en cualquier carpeta (GitHub Pages, Netlify, Vercel)
export default defineConfig({
  base: './',
  plugins: [vue()]
})
