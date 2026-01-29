import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import legacy from '@vitejs/plugin-legacy'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    legacy({
      // FIX: Target Firefox 30. 
      // This forces Babel to convert "..." (spread) into ES5 
      // BEFORE it processes async functions, preventing the crash.
      targets: ['firefox 30'], 
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
    // We removed 'target' here because the plugin handles it now
    minify: 'terser',
    cssMinify: true,
    assetsInlineLimit: 0, 
  }
})
