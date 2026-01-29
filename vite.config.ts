import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import legacy from '@vitejs/plugin-legacy'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    legacy({
      // FORCE compilation for KaiOS (Firefox 48)
      targets: ['firefox 48'],
      additionalLegacyPolyfills: ['regenerator-runtime/runtime'],
      renderLegacyChunks: true,
      polyfills: true
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // CRITICAL FIX: Target Firefox 40 to force Esbuild to convert 
    // "Spread Syntax" (...) into standard JS before the Legacy plugin runs.
    target: ['firefox40'], 
    
    // KaiOS Optimization
    minify: 'terser',
    cssMinify: true,
    assetsInlineLimit: 0, 
  }
})