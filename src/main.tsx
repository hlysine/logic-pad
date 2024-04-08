import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { routeTree } from './ui/router/routeTree.gen';
import NotFound from './ui/router/NotFound';
import './z3example';

// load the selected theme early to avoid flicker
const savedTheme = localStorage.getItem('theme') ?? 'dracula';
document.documentElement.dataset.theme = savedTheme;

const router = createRouter({
  routeTree,
  defaultNotFoundComponent: NotFound,
  defaultPreload: 'intent',
  defaultPreloadStaleTime: 1000 * 60 * 5,
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

ReactDOM.createRoot(document.getElementById('app')!).render(
  <React.StrictMode>
    <>
      <Analytics />
      <SpeedInsights />
      <RouterProvider router={router} />
    </>
  </React.StrictMode>
);
