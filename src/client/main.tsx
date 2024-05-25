import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { routeTree } from './router/routeTree.gen';
import NotFound from './router/NotFound';
import ThemeContext, { themeKey } from './contexts/ThemeContext.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import OnlineContext, { OnlineConsumer } from './contexts/OnlineContext.tsx';

// load the selected theme early to avoid flicker
const savedTheme = localStorage.getItem(themeKey) ?? 'dark';
document.documentElement.dataset.theme = savedTheme;

const queryClient = new QueryClient();

const router = createRouter({
  routeTree,
  defaultNotFoundComponent: NotFound,
  defaultPreload: 'intent',
  defaultPreloadStaleTime: 1000 * 60 * 5,
  context: {
    online: {
      isOnline: undefined,
    },
    queryClient,
  },
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
      <ThemeContext>
        <QueryClientProvider client={queryClient}>
          <OnlineContext>
            <OnlineConsumer>
              {online => (
                <RouterProvider
                  router={router}
                  context={{ online, queryClient }}
                />
              )}
            </OnlineConsumer>
          </OnlineContext>
        </QueryClientProvider>
      </ThemeContext>
    </>
  </React.StrictMode>
);
