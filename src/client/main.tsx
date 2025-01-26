import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { routeTree } from './router/routeTree.gen';
import NotFound from './router/NotFound';
import { themeKey } from './contexts/ThemeContext.tsx';
import { cleanReload } from './components/settings/ResetSite.tsx';

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

function Redirector() {
  if (window.location.host === import.meta.env.VITE_LEGACY_URL) {
    window.location.href = window.location.href.replace(
      import.meta.env.VITE_LEGACY_URL as string,
      import.meta.env.VITE_VERCEL_PROJECT_PRODUCTION_URL as string
    );
  }
  return null;
}

/**
 * Reload the page when a preload error occurs. This usually happens during a new deployment when the user still
 * has the old version of the site open.
 */
window.addEventListener('vite:preloadError', async () => {
  await cleanReload();
});

ReactDOM.createRoot(document.getElementById('app')!).render(
  <React.StrictMode>
    <>
      <Redirector />
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
