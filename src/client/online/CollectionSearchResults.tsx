import { memo } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { FaChevronDown } from 'react-icons/fa';
import Loading from '../components/Loading';
import { CollectionSearchParams } from './CollectionSearchQuery';
import CollectionCard from './CollectionCard';
import { searchCollectionsInfiniteQueryOptions } from '../routes/_layout.search.collections';

export interface CollectionSearchResultsProps {
  params: CollectionSearchParams;
}

export default memo(function CollectionSearchResults({
  params,
}: CollectionSearchResultsProps) {
  const { data, fetchNextPage, hasNextPage, isFetching } = useInfiniteQuery(
    searchCollectionsInfiniteQueryOptions(params)
  );

  return (
    <div className="flex flex-col gap-4 items-center">
      <div className="flex flex-wrap gap-4 justify-center">
        {data?.pages.flatMap(page =>
          page.results.map(collection => (
            <CollectionCard
              key={collection.id}
              collection={collection}
              to="/collection/$collectionId"
              params={{ collectionId: collection.id }}
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
