import { createLazyFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { memo, useEffect } from 'react';
import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { useRouteProtection } from '../router/useRouteProtection';
import {
  userBriefQueryOptions,
  userDetailQueryOptions,
} from './_layout.profile.$userId';
import ResponsiveLayout from '../components/ResponsiveLayout';
import { avatarQueryOptions } from '../components/AccountControl';
import toast from 'react-hot-toast';
import Loading from '../components/Loading';
import { FaCheckSquare, FaEdit } from 'react-icons/fa';
import { toRelativeDate } from '../uiHelper';
import CollectionFollowButton from '../online/CollectionFollowButton';
import { useOnline } from '../contexts/OnlineContext';
import HorizontalScroller from '../components/HorizontalScroller';
import PuzzleCard from '../online/PuzzleCard';
import CollectionCard from '../online/CollectionCard';

export const Route = createLazyFileRoute('/_layout/profile/$userId')({
  component: memo(function ProfilePage() {
    useRouteProtection('online');
    const navigate = useNavigate();
    const { me } = useOnline();
    const avatarQuery = useQuery(avatarQueryOptions(Route.useParams().userId));
    const { data: userBrief } = useSuspenseQuery(
      userBriefQueryOptions(Route.useParams().userId)
    );
    const { data: userDetail, isPending } = useQuery(
      userDetailQueryOptions(Route.useParams().userId)
    );

    useEffect(() => {
      if (userBrief === null) {
        toast.error('User not found');
        void navigate({
          to: '/',
        });
      }
    }, [navigate, userBrief]);

    if (!userBrief) return null;

    return (
      <ResponsiveLayout>
        <div className="flex flex-col gap-4 w-full max-w-[800px] self-center mt-8">
          <div className="flex gap-8 items-start flex-wrap">
            {avatarQuery.isSuccess ? (
              <img
                src={avatarQuery.data ?? undefined}
                alt={`${userBrief.name}'s avatar`}
                className="w-24 h-24 mt-4 rounded-full"
              />
            ) : (
              <Loading className="w-24 h-24 mt-4" />
            )}
            <div className="flex flex-col gap-1 flex-1 min-w-[320px]">
              <span className="text-3xl font-bold">{userBrief.name}</span>
              {userBrief.title && (
                <span className="text-accent font-semibold">
                  {userBrief.title}
                </span>
              )}
              <div className="flex gap-2 mt-2">
                <div className="badge py-1 px-4 h-fit w-fit flex gap-1 whitespace-nowrap">
                  <FaCheckSquare />
                  Solved {userBrief.solveCount}
                </div>
                <div className="badge py-1 px-4 h-fit w-fit flex gap-1 whitespace-nowrap">
                  <FaEdit />
                  Created {userBrief.createCount}
                </div>
              </div>
              <div className="flex gap-4 mt-2">
                <div className="opacity-80">
                  Joined {toRelativeDate(new Date(userBrief.createdAt))}
                </div>
                {userDetail && (
                  <div className="opacity-80">
                    Last active{' '}
                    {toRelativeDate(new Date(userDetail.accessedAt), 'day')}
                  </div>
                )}
              </div>
            </div>
            {userBrief.id === me?.id && (
              <Link to="/settings" className="btn btn-ghost self-end">
                <FaEdit />
                Edit profile
              </Link>
            )}
          </div>
          <div className="flex gap-4 items-center flex-wrap">
            <div className="flex-1 min-w-[320px]">{userBrief.description}</div>
            {isPending ? (
              <Loading className="h-12 w-24" />
            ) : (
              userDetail?.createdPuzzlesCollection && (
                <CollectionFollowButton
                  collectionId={userDetail.createdPuzzlesCollection}
                />
              )
            )}
          </div>
        </div>
        <div className="divider" />
        {isPending ? (
          <Loading />
        ) : (
          <>
            <HorizontalScroller
              title="Created puzzles"
              onExpand={
                userDetail!.createdPuzzlesCollection
                  ? async () => {
                      if (userDetail!.createdPuzzlesCollection)
                        await navigate({
                          to:
                            '/collection/' +
                            userDetail!.createdPuzzlesCollection,
                        });
                    }
                  : undefined
              }
            >
              {userDetail!.createdPuzzles.map(puzzle => (
                <PuzzleCard
                  key={puzzle.id}
                  puzzle={puzzle}
                  expandable={false}
                  onClick={async () => {
                    await navigate({ to: '/solve/' + puzzle.id });
                  }}
                />
              ))}
            </HorizontalScroller>
            <HorizontalScroller
              title="Created collections"
              onExpand={async () => {
                await navigate({
                  to: '/search/collections',
                  search: {
                    q: `creator=${userBrief.id}`,
                  },
                });
              }}
            >
              {userDetail!.createdCollections.map(collection => (
                <CollectionCard
                  key={collection.id}
                  collection={collection}
                  expandable={false}
                  onClick={async () => {
                    await navigate({ to: '/collection/' + collection.id });
                  }}
                />
              ))}
            </HorizontalScroller>
            {userDetail?.solvedPuzzles && (
              <HorizontalScroller
                title="Solved puzzles"
                onExpand={async () => {
                  if (userDetail.solvedPuzzlesCollection)
                    await navigate({
                      to: '/collection/' + userDetail.solvedPuzzlesCollection,
                    });
                }}
              >
                {userDetail.solvedPuzzles.map(puzzle => (
                  <PuzzleCard
                    key={puzzle.id}
                    puzzle={puzzle}
                    expandable={false}
                    onClick={async () => {
                      await navigate({ to: '/solve/' + puzzle.id });
                    }}
                  />
                ))}
              </HorizontalScroller>
            )}
          </>
        )}
      </ResponsiveLayout>
    );
  }),
});
