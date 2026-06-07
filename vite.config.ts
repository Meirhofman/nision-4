import { defineConfig } from 'vite'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  envDir: __dirname,
  server: {
    host: true, // Allow access from mobile on same network (e.g. http://192.168.x.x:5173)
    port: 5173,
    strictPort: true,
    open: '/landing',
    watch: {
      // Watch for file changes in all these directories
      ignored: ['!**/node_modules/**'],
      usePolling: true,
      interval: 100,
    },
    hmr: {
      overlay: true, // Show error overlay
    },
  },
  build: {
    // Optimize build for faster development
    sourcemap: true,
    minify: false,
  },
  plugins: [
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
  ],
  base: '/',
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
      'figma:asset': path.resolve(__dirname, './src/assets'),
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv', '**/*.jpg', '**/*.jpeg', '**/*.png', '**/*.gif'],
})