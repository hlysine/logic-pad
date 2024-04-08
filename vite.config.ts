import million from 'million/compiler';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { TanStackRouterVite } from '@tanstack/router-vite-plugin';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    million.vite({ auto: true }),
    react(),
    TanStackRouterVite({
      generatedRouteTree: 'src/ui/router/routeTree.gen.ts',
    }),
    VitePWA({
      workbox: {
        skipWaiting: true,
        clientsClaim: true,
      },
      manifest: {
        theme_color: '#414558',
      },
    }),
  ],
});
