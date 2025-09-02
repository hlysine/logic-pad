import { createFileRoute, redirect } from '@tanstack/react-router';
import { api, bidirectionalInfiniteQuery, queryClient } from '../online/api';
import toast from 'react-hot-toast';
import { CollectionSearchParams } from '../online/CollectionSearchQuery';
import { router } from '../main';

export const followedCollectionInfiniteQueryOptions = (
  search: CollectionSearchParams
) =>
  bidirectionalInfiniteQuery(
    ['user', 'me', 'followed-collections', search],
    (cursorBefore, cursorAfter) =>
      api.listMyFollowedCollections(search, cursorBefore, cursorAfter)
  );

export const Route = createFileRoute('/_layout/my-follows')({
  loader: async () => {
    try {
      await Promise.all([
        queryClient.ensureInfiniteQueryData(
          followedCollectionInfiniteQueryOptions(router.state.location.search)
        ),
      ]);
    } catch (error) {
      toast.error((error as Error).message);
      throw redirect({
        to: '/',
      });
    }
  },
});
