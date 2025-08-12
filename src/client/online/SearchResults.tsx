import { memo } from 'react';
import { SearchParams } from '../routes/_layout.search';
import { useInfiniteQuery } from '@tanstack/react-query';
import { api } from './api';
import { FaChevronDown } from 'react-icons/fa';
import Loading from '../components/Loading';
import toast from 'react-hot-toast';

export interface SearchResultsProps {
  params: SearchParams;
}

export default memo(function SearchResults({ params }: SearchResultsProps) {
  const { data, fetchNextPage, hasNextPage, isFetching } = useInfiniteQuery({
    queryKey: ['puzzle', 'search', params],
    queryFn: ({ pageParam }: { pageParam: string | undefined }) => {
      return api.searchPuzzles(params.q ?? '', pageParam);
    },
    initialPageParam: undefined,
    getNextPageParam: lastPage =>
      lastPage.results.length > 0
        ? lastPage.results[lastPage.results.length - 1].id
        : undefined,
    getPreviousPageParam: firstPage =>
      firstPage.results.length > 0 ? firstPage.results[0].id : undefined,
    throwOnError(error) {
      toast.error(error.message);
      return false;
    },
    retry: false,
  });

  return (
    <div className="flex flex-col gap-4 items-center">
      <div className="flex flex-wrap gap-4">
        {data?.pages.flatMap(page =>
          page.results.map(puzzle => <p key={puzzle.id}>{puzzle.title}</p>)
        )}
      </div>
      {isFetching && <Loading />}
      {hasNextPage && (
        <button className="btn" onClick={async () => await fetchNextPage()}>
          Load more
          <FaChevronDown />
        </button>
      )}
    </div>
  );
});
