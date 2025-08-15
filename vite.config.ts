import { defineConfig, searchForWorkspaceRoot } from 'vite';
import react from '@vitejs/plugin-react';
import { tanstackRouter } from '@tanstack/router-vite-plugin';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';
import { replaceCodePlugin } from 'vite-plugin-replace';
import { viteStaticCopy } from 'vite-plugin-static-copy';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: 'node_modules/z3-solver/build/z3-built.js',
          dest: 'assets',
        },
        {
          src: 'node_modules/z3-solver/build/z3-built.wasm',
          dest: 'assets',
        },
      ],
    }),
    replaceCodePlugin({
      replacements: [
        {
          from: 'Worker.js', // 'js' extension is required when @logic-pad/core is compiled by tsc
          to: 'Worker.ts', // but vite uses 'ts' extension for worker imports
        },
      ],
    }),
    react(),
    tanstackRouter({
      routesDirectory: './src/client/routes',
      generatedRouteTree: './src/client/router/routeTree.gen.ts',
    }),
    VitePWA({
      registerType: 'prompt',
      includeAssets: [
        'favicon.ico',
        '*.svg',
        '*.png',
        'assets/z3-built.js',
        'assets/z3-built.wasm',
        'assets/z3-built.worker.js',
      ],
      workbox: {
        maximumFileSizeToCacheInBytes: 50 * 1024 * 1024,
        navigateFallbackDenylist: [/^\/api/],
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
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, ''),
      },
    },
  },
  optimizeDeps: {
    exclude: ['@logic-pad/core', 'logic-pad-solver-core'],
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
