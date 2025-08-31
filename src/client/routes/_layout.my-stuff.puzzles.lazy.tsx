import { createLazyFileRoute, Link } from '@tanstack/react-router';
import { memo } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import { useInfiniteQuery } from '@tanstack/react-query';
import { api, bidirectionalInfiniteQuery } from '../online/api';
import PuzzleCard from '../online/PuzzleCard';
import Loading from '../components/Loading';
import { useRouteProtection } from '../router/useRouteProtection';
import PuzzleSearchQuery from '../online/PuzzleSearchQuery';

export const Route = createLazyFileRoute('/_layout/my-stuff/puzzles')({
  component: memo(function MyStuff() {
    useRouteProtection('login');
    const navigate = Route.useNavigate();
    const search = Route.useSearch();
    const { data, fetchNextPage, hasNextPage, isFetching } = useInfiniteQuery(
      bidirectionalInfiniteQuery(
        ['user', 'me', 'puzzles', search],
        (cursorBefore, cursorAfter) =>
          api.listMyPuzzles(search, cursorBefore, cursorAfter)
      )
    );

    return (
      <>
        <div role="tablist" className="tabs tabs-lg tabs-bordered">
          <Link
            to="/my-stuff/puzzles"
            role="tab"
            className="tab tab-active text-neutral-content"
          >
            Puzzles
          </Link>
          <Link
            to="/my-stuff/collections"
            role="tab"
            className="tab text-neutral-content"
          >
            Collections
          </Link>
        </div>
        <PuzzleSearchQuery
          params={search}
          publicPuzzlesOnly={false}
          onChange={async params => await navigate({ search: params })}
        />
        <div className="divider m-0" />
        <div className="flex flex-col gap-4 items-center">
          <div className="flex flex-wrap gap-4 justify-center">
            {data?.pages.flatMap(page =>
              page.results.map(puzzle => (
                <PuzzleCard
                  key={puzzle.id}
                  puzzle={puzzle}
                  onClick={async () => {
                    await navigate({
                      to: `/create/${puzzle.id}`,
                    });
                  }}
                />
              ))
            )}
          </div>
          {isFetching ? (
            <Loading />
          ) : hasNextPage ? (
            <button className="btn" onClick={async () => await fetchNextPage()}>
              Load more
              <FaChevronDown />
            </button>
          ) : null}
        </div>
      </>
    );
  }),
});
