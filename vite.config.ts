import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'node:path';

/**
 * Plugin to suppress expected warnings from third-party libraries
 */
function suppressThirdPartyWarnings() {
  return {
    name: 'suppress-third-party-warnings',
    config() {
      // Override console.warn during build to filter out specific warnings
      const originalWarn = console.warn;
      console.warn = (...args) => {
        const msg = args[0];
        if (
          typeof msg === 'string' &&
          (msg.includes("new URL('./', import.meta.url)") ||
            msg.includes('espeak-ng') ||
            msg.includes('@vite-ignore'))
        ) {
          // Suppress these expected warnings from espeak-ng
          return;
        }
        originalWarn.apply(console, args);
      };
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  optimizeDeps: {
    exclude: ['espeak-ng'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      // Provide empty module for Node.js 'module' builtin used by espeak-ng
      module: path.resolve(__dirname, './src/utils/empty-module.ts'),
    },
  },
  build: {
    // Increase chunk size warning limit for large WASM files
    chunkSizeWarningLimit: 2000, // 2MB (espeak-ng WASM is large)
    rollupOptions: {
      onwarn(warning, warn) {
        // Suppress warnings from espeak-ng about runtime URL resolution
        if (warning.code === 'UNUSED_EXTERNAL_IMPORT' || warning.message?.includes('espeak-ng')) {
          return;
        }
        warn(warning);
      },
    },
    // Suppress warnings for dynamic imports that are runtime-resolved
    commonjsOptions: {
      ignoreDynamicRequires: true,
    },
  },
  plugins: [
    suppressThirdPartyWarnings(),
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'Spelling Bee Prep',
        short_name: 'SpellingBee',
        description: 'Practice spelling with interactive challenges',
        theme_color: '#1976d2',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
      workbox: {
        // Increase the file size limit to accommodate espeak-ng WASM file
        maximumFileSizeToCacheInBytes: 20 * 1024 * 1024, // 20MB
        // Exclude large WASM files from precaching - they'll be runtime cached instead
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json}'],
        // Runtime caching for WASM files
        runtimeCaching: [
          {
            urlPattern: /\.wasm$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'wasm-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
            },
          },
        ],
      },
    }),
  ],
});
