import { createLazyFileRoute, Link } from '@tanstack/react-router';
import { memo } from 'react';
import TopBottomLayout from '../components/TopBottomLayout';
import PuzzleSearchResults from '../online/PuzzleSearchResults';
import PuzzleSearchQuery from '../online/PuzzleSearchQuery';
import { useRouteProtection } from '../router/useRouteProtection';
import { FaSearch } from 'react-icons/fa';

export const Route = createLazyFileRoute('/_layout/search/puzzles')({
  component: memo(function Home() {
    useRouteProtection('online');
    const navigate = Route.useNavigate();
    const search = Route.useSearch();

    return (
      <TopBottomLayout
        top={
          <>
            <div className="text-3xl mt-8">
              <FaSearch className="inline-block me-4" />
              Search
            </div>
            <div role="tablist" className="tabs tabs-lg tabs-bordered">
              <Link to="/search/puzzles" role="tab" className="tab tab-active">
                Puzzles
              </Link>
              <Link to="/search/collections" role="tab" className="tab">
                Collections
              </Link>
            </div>
            <PuzzleSearchQuery
              params={search}
              onChange={async params => await navigate({ search: params })}
            />
          </>
        }
      >
        <PuzzleSearchResults params={search} />
      </TopBottomLayout>
    );
  }),
});
