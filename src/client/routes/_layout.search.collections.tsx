import { createFileRoute, redirect } from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-adapter';
import {
  CollectionSearchParams,
  collectionSearchSchema,
} from '../online/CollectionSearchQuery';
import { api, bidirectionalInfiniteQuery, queryClient } from '../online/api';
import { router } from '../main';
import toast from 'react-hot-toast';

export const searchCollectionsInfiniteQueryOptions = (
  search: CollectionSearchParams
) =>
  bidirectionalInfiniteQuery(
    ['collection', 'search', search],
    (cursorBefore, cursorAfter) =>
      api.searchCollections(search, cursorBefore, cursorAfter)
  );

export const Route = createFileRoute('/_layout/search/collections')({
  validateSearch: zodValidator(collectionSearchSchema),
  loader: async () => {
    try {
      await Promise.all([
        queryClient.ensureInfiniteQueryData(
          searchCollectionsInfiniteQueryOptions(router.state.location.search)
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
