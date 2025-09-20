import { createRouter } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';
import NotFound from './NotFound';
import Error from './Error';
import Loading from '../components/Loading';

export const router = createRouter({
  routeTree,
  defaultNotFoundComponent: NotFound,
  defaultErrorComponent: Error,
  defaultPendingComponent: () => <Loading />,
  defaultPreload: 'intent',
  defaultPreloadStaleTime: 1000 * 60 * 5,
  defaultPendingMs: 500,
  defaultPendingMinMs: 0,
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
