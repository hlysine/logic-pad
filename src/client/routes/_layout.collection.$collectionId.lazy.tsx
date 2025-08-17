import { createLazyFileRoute } from '@tanstack/react-router';
import { memo } from 'react';
import ResponsiveLayout from '../components/ResponsiveLayout';
import { FaChevronDown, FaThList, FaUser } from 'react-icons/fa';
import {
  useSuspenseInfiniteQuery,
  useSuspenseQuery,
} from '@tanstack/react-query';
import PuzzleCard from '../online/PuzzleCard';
import Loading from '../components/Loading';
import { useRouteProtection } from '../router/useRouteProtection';
import {
  collectionInfiniteQueryOptions,
  collectionQueryOptions,
} from './_layout.collection.$collectionId';
import UserCard from '../metadata/UserCard';
import { toRelativeDate } from '../uiHelper';
import CollectionFollowButton from '../online/CollectionFollowButton';
import { ResourceStatus } from '../online/data';

export const Route = createLazyFileRoute('/_layout/collection/$collectionId')({
  component: memo(function Collection() {
    useRouteProtection('online');
    const navigate = Route.useNavigate();
    const params = Route.useParams();
    const { data: collectionBrief } = useSuspenseQuery(
      collectionQueryOptions(params.collectionId)
    );
    const {
      data: puzzles,
      fetchNextPage,
      hasNextPage,
      isFetching,
    } = useSuspenseInfiniteQuery(
      collectionInfiniteQueryOptions(params.collectionId)
    );

    return (
      <ResponsiveLayout>
        <div className="text-3xl mt-8">
          <FaThList className="inline-block me-4" />
          {collectionBrief.title}
        </div>
        <UserCard user={collectionBrief.creator} />
        <div className="flex gap-4 items-center">
          <span className="badge badge-ghost badge-lg p-4 bg-base-100 text-base-content border-0">
            <FaUser className="inline-block me-2" />
            {collectionBrief.followCount} follows
          </span>
          <span className="opacity-80">
            Created {toRelativeDate(new Date(collectionBrief.createdAt))}
          </span>
          <span className="opacity-80">
            Updated {toRelativeDate(new Date(collectionBrief.updatedAt))}
          </span>
        </div>
        <div className="flex gap-4 items-center mt-4">
          <div className="flex-1">{collectionBrief.description}</div>
          {collectionBrief.status === ResourceStatus.Public ? (
            <CollectionFollowButton collectionId={collectionBrief.id} />
          ) : (
            <div className="btn btn-disabled">Private collection</div>
          )}
        </div>
        <div className="divider" />
        <div className="flex flex-col gap-4 items-center">
          {puzzles && puzzles.pages.length > 0 && (
            <div className="w-full">{puzzles.pages[0].total} puzzles</div>
          )}
          <div className="flex flex-wrap gap-4 justify-center">
            {puzzles?.pages.flatMap(page =>
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
          ) : null}
        </div>
      </ResponsiveLayout>
    );
  }),
});
