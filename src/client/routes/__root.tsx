import { Outlet, createRootRoute } from '@tanstack/react-router';
import ThemeContext from '../contexts/ThemeContext.tsx';
import DocumentTitle from '../components/DocumentTitle';
import PWAPrompt from '../components/PWAPrompt';
import TanStackDevTools from '../router/TanStackDevTools';
import { memo } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import OnlineContext from '../contexts/OnlineContext.tsx';

const queryClient = new QueryClient();

export const Route = createRootRoute({
  component: memo(function Root() {
    return (
      <ThemeContext>
        <QueryClientProvider client={queryClient}>
          <OnlineContext>
            <div className="h-dvh w-dvw overflow-y-auto overflow-x-hidden bg-neutral text-neutral-content">
              <DocumentTitle>Logic Pad</DocumentTitle>
              <PWAPrompt />
              <div className="flex flex-col items-stretch w-full min-h-full xl:h-full">
                <Outlet />
                <TanStackDevTools />
              </div>
            </div>
          </OnlineContext>
        </QueryClientProvider>
      </ThemeContext>
    );
  }),
});
