import { memo } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { api, bidirectionalInfiniteQuery } from './api';
import { FaChevronDown } from 'react-icons/fa';
import Loading from '../components/Loading';
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
  const { data, fetchNextPage, hasNextPage, isFetching } = useInfiniteQuery(
    bidirectionalInfiniteQuery(
      ['collection', 'search', params],
      (cursorBefore, cursorAfter) =>
        api.searchCollections(params, cursorBefore, cursorAfter)
    )
  );

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
