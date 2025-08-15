import { createLazyFileRoute } from '@tanstack/react-router';
import { memo } from 'react';
import TopBottomLayout from '../components/TopBottomLayout';
import PuzzleSearchResults from '../online/PuzzleSearchResults';
import PuzzleSearchQuery from '../online/PuzzleSearchQuery';
import { useRouteProtection } from '../router/useRouteProtection';

export const Route = createLazyFileRoute('/_layout/search')({
  component: memo(function Home() {
    useRouteProtection('online');
    const navigate = Route.useNavigate();
    const search = Route.useSearch();

    return (
      <TopBottomLayout
        top={
          <PuzzleSearchQuery
            params={search}
            onChange={async params => await navigate({ search: params })}
          />
        }
      >
        <PuzzleSearchResults params={search} />
      </TopBottomLayout>
    );
  }),
});
