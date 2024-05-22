import million from 'million/compiler';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { TanStackRouterVite } from '@tanstack/router-vite-plugin';
import { VitePWA } from 'vite-plugin-pwa';
import { EnclosurePlugin } from './scripts/enclosurePlugin';
import { ImportsPlugin } from './scripts/importsPlugin';
import { stopVitePlugin } from './scripts/stopVitePlugin';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    ImportsPlugin({
      entries: [
        {
          cwd: 'src/data/symbols',
          generated: 'symbols.gen.ts',
          import: 'instance',
          glob: ['./**/*.ts', '!./index.ts'],
        },
        {
          cwd: 'src/data/rules',
          generated: 'rules.gen.ts',
          import: 'instance',
          glob: ['./**/*.ts', '!./index.ts'],
        },
        {
          cwd: 'src/data/solver/z3/modules',
          generated: 'modules.gen.ts',
          import: 'instance',
          glob: ['./**/*.ts', '!./index.ts'],
        },
      ],
    }),
    EnclosurePlugin({
      dataPath: 'src/data',
      generatedPath: 'src/client/editor/enclosure.gen.ts',
    }),
    million.vite({ auto: true }),
    react(),
    TanStackRouterVite({
      routesDirectory: './src/client/routes',
      generatedRouteTree: './src/client/router/routeTree.gen.ts',
    }),
    VitePWA({
      registerType: 'prompt',
      includeAssets: [
        'favicon.ico',
        'apple-touch-icon-180x180.png',
        'z3-built.js',
        'z3-built.wasm',
        'z3-built.worker.js',
      ],
      manifest: {
        name: 'Logic Pad',
        short_name: 'Logic Pad',
        description: 'A modern, open-source web app for grid-based puzzles.',
        theme_color: '#414558',
        background_color: '#edeff7',
        icons: [
          {
            src: 'pwa-64x64.png',
            sizes: '64x64',
            type: 'image/png',
          },
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
          {
            src: 'maskable-icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
    }),
    stopVitePlugin(),
  ],
  server: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
    },
  },
});
