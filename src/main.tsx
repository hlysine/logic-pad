import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { routeTree } from './ui/router/routeTree.gen';
import NotFound from './ui/router/NotFound';
import { themeKey } from './ui/ThemeContext';

// load the selected theme early to avoid flicker
const savedTheme = localStorage.getItem(themeKey) ?? 'dark';
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
      <div id="color-ref-error" className="text-error hidden">
        {/* For canvas components to retrieve this color */}
      </div>
      <div id="color-ref-accent" className="text-accent hidden">
        {/* For canvas components to retrieve this color */}
      </div>
      <div id="color-ref-info" className="text-info hidden">
        {/* For canvas components to retrieve this color */}
      </div>
      <div id="color-ref-black" className="text-black hidden">
        {/* For canvas components to retrieve this color */}
      </div>
      <div id="color-ref-white" className="text-white hidden">
        {/* For canvas components to retrieve this color */}
      </div>
      <div
        id="color-ref-neutral-content"
        className="text-neutral-content/20 hidden"
      >
        {/* For canvas components to retrieve this color */}
      </div>
      <SpeedInsights />
      <RouterProvider router={router} />
    </>
  </React.StrictMode>
);
