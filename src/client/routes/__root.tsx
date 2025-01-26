import { Outlet, createRootRoute } from '@tanstack/react-router';
import ThemeContext from '../contexts/ThemeContext.tsx';
import DocumentTitle from '../components/DocumentTitle';
import TanStackDevTools from '../router/TanStackDevTools';
import { memo } from 'react';

export const Route = createRootRoute({
  component: memo(function Root() {
    return (
      <ThemeContext>
        <div className="h-dvh w-dvw overflow-y-auto overflow-x-hidden bg-neutral text-neutral-content">
          <DocumentTitle>Logic Pad</DocumentTitle>
          <div className="flex flex-col items-stretch w-full min-h-full xl:h-full">
            <Outlet />
            <TanStackDevTools />
          </div>
        </div>
      </ThemeContext>
    );
  }),
});
