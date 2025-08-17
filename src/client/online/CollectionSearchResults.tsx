import { memo } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { api } from './api';
import { FaChevronDown } from 'react-icons/fa';
import Loading from '../components/Loading';
import toast from 'react-hot-toast';
import { useNavigate } from '@tanstack/react-router';
import { CollectionSearchParams } from './CollectionSearchQuery';
import CollectionCard from './CollectionCard';

export interface CollectionSearchResultsProps {
  params: CollectionSearchParams;
}

export default memo(function CollectionSearchResults({
  params,
}: CollectionSearchResultsProps) {
  const navigate = useNavigate();
  const { data, fetchNextPage, hasNextPage, isFetching } = useInfiniteQuery({
    queryKey: ['collection', 'search', params],
    queryFn: ({ pageParam }: { pageParam: string | undefined }) => {
      return api.searchCollections(params, pageParam);
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
        <div className="w-full">{data.pages[0].total} collections</div>
      )}
      <div className="flex flex-wrap gap-4 justify-center">
        {data?.pages.flatMap(page =>
          page.results.map(collection => (
            <CollectionCard
              key={collection.id}
              collection={collection}
              onClick={async () => {
                await navigate({
                  to: `/collection/${collection.id}`,
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
  );
});
