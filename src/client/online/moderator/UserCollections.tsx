import { useInfiniteQuery } from '@tanstack/react-query';
import { memo, useMemo } from 'react';
import Loading from '../../components/Loading';
import InfiniteScrollTrigger from '../../components/InfiniteScrollTrigger';
import { CollectionBrief, ResourceStatus } from '../data';
import { FaEyeSlash, FaListOl, FaUser } from 'react-icons/fa';
import { count, toRelativeDate } from '../../uiHelper';
import { CollectionSearchParams } from '../CollectionSearchQuery';
import { searchCollectionsInfiniteQueryOptions } from '../CollectionSearchResults';
import { TbLayoutGrid } from 'react-icons/tb';
import Skeleton from '../../components/Skeleton';
import { Link } from '@tanstack/react-router';

const UserCollection = memo(function UserCollection({
  collection,
}: {
  collection: CollectionBrief;
}) {
  return (
    <div className="flex flex-col items-start self-stretch gap-1 shrink-0">
      <Link
        to="/collection/$collectionId"
        params={{ collectionId: collection.id }}
        className="text-lg"
      >
        {collection.isSeries && (
          <FaListOl size={14} className="inline text-accent" />
        )}{' '}
        {collection.title.length === 0 ? (
          <span className="opacity-80">Untitled Collection</span>
        ) : (
          collection.title
        )}
      </Link>
      <div className="text-xs opacity-80 flex flex-wrap gap-2">
        <span>Created {toRelativeDate(new Date(collection.createdAt))}</span>
        <span>Updated {toRelativeDate(new Date(collection.updatedAt))}</span>
      </div>
      <div className="flex gap-4 text-sm opacity-80">
        {collection.puzzleCount !== null && (
          <span className="flex items-center">
            <TbLayoutGrid className="me-2" /> {collection.puzzleCount}
          </span>
        )}
        {collection.status === ResourceStatus.Public ? (
          <span className="flex items-center">
            <FaUser className="me-2" /> {collection.followCount}
          </span>
        ) : (
          <span className="flex items-center">
            <FaEyeSlash className="me-2" />
            Private
          </span>
        )}
      </div>
      <div className="text-xs wrap-break-word">{collection.description}</div>
      <div className="divider my-0" />
    </div>
  );
});

export interface UserCollectionsProps {
  userId: string;
}

export default memo(function UserCollections({ userId }: UserCollectionsProps) {
  const searchParams = useMemo<CollectionSearchParams>(
    () => ({
      q: `creator=${userId}`,
      sort: 'updated-desc',
    }),
    [userId]
  );
  const { data, isPending, isFetching, hasNextPage, fetchNextPage } =
    useInfiniteQuery(searchCollectionsInfiniteQueryOptions(searchParams));

  return (
    <div className="flex flex-col gap-4 w-[400px] max-w-full shrink-0">
      <h2 className="font-semibold text-xl shrink-0">
        Collections{' '}
        {data?.pages[0] && (
          <span className="badge badge-neutral">
            {count(data?.pages[0]?.total)}
          </span>
        )}
      </h2>
      <div className="flex-1 overflow-y-auto infinte-scroll">
        {isPending ? (
          <div className="flex flex-col gap-4 items-center">
            {Array.from({ length: 3 }).map((_, i) => (
              <div className="flex flex-col gap-2 w-full items-stretch" key={i}>
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-20" />
                <div className="divider my-0" />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-4 items-center">
            {data?.pages.flatMap(page =>
              page.results.map(collection => (
                <UserCollection key={collection.id} collection={collection} />
              ))
            )}
            {isFetching ? (
              <Loading className="h-fit" />
            ) : hasNextPage ? (
              <InfiniteScrollTrigger
                onLoadMore={async () => await fetchNextPage()}
              />
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
});
