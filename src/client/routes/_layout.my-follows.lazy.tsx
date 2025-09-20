import { createLazyFileRoute } from '@tanstack/react-router';
import { memo } from 'react';
import { FaFolder } from 'react-icons/fa';
import Loading from '../components/Loading';
import { useRouteProtection } from '../router/useRouteProtection';
import { useInfiniteQuery } from '@tanstack/react-query';
import { followedCollectionsInfiniteQueryOptions } from './_layout.my-follows';
import CollectionSearchQuery from '../online/CollectionSearchQuery';
import ResponsiveLayout from '../components/ResponsiveLayout';
import CollectionCard from '../online/CollectionCard';
import InfiniteScrollTrigger from '../components/InfiniteScrollTrigger';

export const Route = createLazyFileRoute('/_layout/my-follows')({
  component: memo(function Collection() {
    useRouteProtection('login');
    const navigate = Route.useNavigate();
    const search = Route.useSearch();
    const { data, fetchNextPage, hasNextPage, isFetching } = useInfiniteQuery(
      followedCollectionsInfiniteQueryOptions(search)
    );

    return (
      <ResponsiveLayout>
        <div className="flex mt-8 items-center justify-between flex-wrap gap-4">
          <div className="text-3xl">
            <FaFolder className="inline-block me-4" />
            My follows
          </div>
        </div>
        <CollectionSearchQuery
          params={search}
          onChange={async params => await navigate({ search: params })}
        />
        <div className="divider m-0" />
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
            <Loading className="h-fit" />
          ) : hasNextPage ? (
            <InfiniteScrollTrigger
              onLoadMore={async () => await fetchNextPage()}
            />
          ) : null}
        </div>
      </ResponsiveLayout>
    );
  }),
});
