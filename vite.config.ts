import million from 'million/compiler';
import { defineConfig, searchForWorkspaceRoot } from 'vite';
import react from '@vitejs/plugin-react';
import { TanStackRouterVite } from '@tanstack/router-vite-plugin';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';
import { replaceCodePlugin } from 'vite-plugin-replace';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    replaceCodePlugin({
      replacements: [
        {
          from: 'Worker.js', // 'js' extension is required when @logic-pad/core is compiled by tsc
          to: 'Worker.ts', // but vite uses 'ts' extension for worker imports
        },
      ],
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
      workbox: {
        maximumFileSizeToCacheInBytes: 50 * 1024 * 1024,
      },
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
  ],
  server: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
    },
    fs: {
      allow: [searchForWorkspaceRoot(process.cwd()), './', '../logic-core'], // allow serving files from the logic-core package for local testing
    },
  },
  optimizeDeps: {
    exclude: ['@logic-pad/core'],
    include: ['event-iterator', 'z3-solver'],
  },
  resolve: {
    alias: [
      {
        find: '@logic-pad/core/assets',
        replacement: path.join(
          searchForWorkspaceRoot(process.cwd()),
          './packages/logic-core/assets'
        ),
      },
      {
        find: '@logic-pad/core',
        replacement: path.join(
          searchForWorkspaceRoot(process.cwd()),
          './packages/logic-core/src'
        ),
      },
    ],
  },
});
