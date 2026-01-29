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
    // KaiOS has small memory, compress heavily
    minify: 'terser',
    cssMinify: true,
    // Do not inline assets (KaiOS prefers separate files)
    assetsInlineLimit: 0, 
  }
})