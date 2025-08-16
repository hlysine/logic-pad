import { createLazyFileRoute } from '@tanstack/react-router';
import { memo } from 'react';
import TopBottomLayout from '../components/TopBottomLayout';
import { FaChevronDown, FaFolder } from 'react-icons/fa';
import { useInfiniteQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { api } from '../online/api';
import PuzzleCard from '../online/PuzzleCard';
import Loading from '../components/Loading';
import { useRouteProtection } from '../router/useRouteProtection';
import PuzzleSearchQuery from '../online/PuzzleSearchQuery';

export const Route = createLazyFileRoute('/_layout/my-stuff')({
  component: memo(function MyStuff() {
    useRouteProtection('login');
    const navigate = Route.useNavigate();
    const search = Route.useSearch();
    const { data, fetchNextPage, hasNextPage, isFetching } = useInfiniteQuery({
      queryKey: ['user', 'me', 'puzzles', search],
      queryFn: ({ pageParam }: { pageParam: string | undefined }) => {
        return api.listMyPuzzles(search, pageParam);
      },
      initialPageParam: undefined,
      getNextPageParam: (lastPage, allPages) => {
        const totalCount = allPages.reduce(
          (acc, page) => acc + page.results.length,
          0
        );
        if (totalCount === lastPage.total) return undefined;
        return lastPage.results.length > 0
          ? lastPage.results[lastPage.results.length - 1].id
          : undefined;
      },
      getPreviousPageParam: firstPage =>
        firstPage.results.length > 0 ? firstPage.results[0].id : undefined,
      throwOnError(error) {
        toast.error(error.message);
        return false;
      },
      retry: false,
      staleTime: 1000 * 60,
    });

    return (
      <TopBottomLayout
        top={
          <>
            <div className="text-3xl mt-8">
              <FaFolder className="inline-block me-2" />
              My stuff
            </div>
            <div role="tablist" className="tabs tabs-lg tabs-bordered">
              <a role="tab" className="tab tab-active">
                Puzzles
              </a>
              <a role="tab" className="tab opacity-50">
                Collections
              </a>
            </div>
            <PuzzleSearchQuery
              params={search}
              onChange={async params => await navigate({ search: params })}
            />
          </>
        }
      >
        <div className="flex flex-col gap-4 items-center">
          {data && data.pages.length > 0 && (
            <div className="w-full">{data.pages[0].total} results</div>
          )}
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
          ) : (
            <div>No more results</div>
          )}
        </div>
      </TopBottomLayout>
    );
  }),
});
