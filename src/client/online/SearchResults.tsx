import { memo } from 'react';
import { SearchParams } from '../routes/_layout.search';
import { useDebounce } from '@uidotdev/usehooks';
import { useInfiniteQuery } from '@tanstack/react-query';
import { api } from './api';
import { FaChevronDown } from 'react-icons/fa';
import Loading from '../components/Loading';
import toast from 'react-hot-toast';
import PuzzleCard from './PuzzleCard';
import { useNavigate } from '@tanstack/react-router';

export interface SearchResultsProps {
  params: SearchParams;
}

export default memo(function SearchResults({ params }: SearchResultsProps) {
  const debouncedParams = useDebounce(params, 500);
  const navigate = useNavigate();
  const { data, fetchNextPage, hasNextPage, isFetching } = useInfiniteQuery({
    queryKey: ['puzzle', 'search', debouncedParams],
    queryFn: ({ pageParam }: { pageParam: string | undefined }) => {
      return api.searchPuzzles(debouncedParams, pageParam);
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
                  to: `/solve/${puzzle.id}`,
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
  );
});
