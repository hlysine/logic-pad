import React, { Suspense } from 'react';

const TanStackRouterDevtools = import.meta.env.PROD
  ? () => null // Render nothing in production
  : React.lazy(() =>
      // Lazy load in development
      import('@tanstack/router-devtools').then(m => ({
        default: m.TanStackRouterDevtools,
      }))
    );
const TanStackQueryDevtools = import.meta.env.PROD
  ? () => null // Render nothing in production
  : React.lazy(() =>
      // Lazy load in development
      import('@tanstack/react-query-devtools').then(m => ({
        default: m.ReactQueryDevtools,
      }))
    );

export default function TanStackDevTools() {
  return (
    <Suspense>
      <TanStackRouterDevtools />
      <TanStackQueryDevtools initialIsOpen={false} />
    </Suspense>
  );
}
