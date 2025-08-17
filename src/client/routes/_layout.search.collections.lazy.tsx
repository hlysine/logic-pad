import { createLazyFileRoute, Link } from '@tanstack/react-router';
import { memo } from 'react';
import { useRouteProtection } from '../router/useRouteProtection';
import CollectionSearchQuery from '../online/CollectionSearchQuery';
import CollectionSearchResults from '../online/CollectionSearchResults';

export const Route = createLazyFileRoute('/_layout/search/collections')({
  component: memo(function Home() {
    useRouteProtection('online');
    const navigate = Route.useNavigate();
    const search = Route.useSearch();

    return (
      <>
        <div role="tablist" className="tabs tabs-lg tabs-bordered">
          <Link to="/search/puzzles" role="tab" className="tab">
            Puzzles
          </Link>
          <Link to="/search/collections" role="tab" className="tab tab-active">
            Collections
          </Link>
        </div>
        <CollectionSearchQuery
          params={search}
          onChange={async params => await navigate({ search: params })}
        />
        <div className="divider" />
        <CollectionSearchResults params={search} />
      </>
    );
  }),
});
