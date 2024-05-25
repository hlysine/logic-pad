import { Outlet, createRootRouteWithContext } from '@tanstack/react-router';
import DocumentTitle from '../components/DocumentTitle';
import PWAPrompt from '../components/PWAPrompt';
import TanStackDevTools from '../router/TanStackDevTools';
import { memo } from 'react';
import { QueryClient } from '@tanstack/react-query';
import { OnlineContext } from '../contexts/OnlineContext';

interface RouterContext {
  online: OnlineContext;
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: memo(function Root() {
    return (
      <div className="h-dvh w-dvw overflow-y-auto overflow-x-hidden bg-neutral text-neutral-content">
        <DocumentTitle>Logic Pad</DocumentTitle>
        <PWAPrompt />
        <div className="flex flex-col items-stretch w-full min-h-full xl:h-full">
          <Outlet />
          <TanStackDevTools />
        </div>
      </div>
    );
  }),
});
