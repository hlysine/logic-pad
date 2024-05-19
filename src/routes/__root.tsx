import { Outlet, createRootRoute } from '@tanstack/react-router';
import ThemeContext from '../ui/ThemeContext';
import DocumentTitle from '../ui/components/DocumentTitle';
import PWAPrompt from '../ui/components/PWAPrompt';
import TanStackDevTools from '../ui/router/TanStackDevTools';
import { memo } from 'react';

export const Route = createRootRoute({
  component: memo(function Root() {
    return (
      <ThemeContext>
        <div className="h-dvh w-dvw overflow-y-auto overflow-x-hidden bg-neutral text-neutral-content">
          <DocumentTitle>Logic Pad</DocumentTitle>
          <PWAPrompt />
          <div className="flex flex-col items-stretch w-full min-h-full xl:h-full">
            <Outlet />
            <TanStackDevTools />
          </div>
        </div>
      </ThemeContext>
    );
  }),
});
