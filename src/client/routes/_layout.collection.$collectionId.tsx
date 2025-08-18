import { createFileRoute, redirect } from '@tanstack/react-router';
import { queryOptions } from '@tanstack/react-query';
import { api, bidirectionalInfiniteQuery, queryClient } from '../online/api';
import toast from 'react-hot-toast';

export const collectionQueryOptions = (collectionId: string) =>
  queryOptions({
    queryKey: ['collection', collectionId],
    queryFn: () => api.getCollectionBrief(collectionId),
  });

export const collectionInfiniteQueryOptions = (collectionId: string) =>
  bidirectionalInfiniteQuery(
    ['collection', collectionId, 'puzzles'],
    (cursorBefore, cursorAfter) =>
      api.listCollectionPuzzles(collectionId, cursorBefore, cursorAfter)
  );

export const Route = createFileRoute('/_layout/collection/$collectionId')({
  remountDeps: ({ params }) => params.collectionId,
  loader: async ({ params }) => {
    try {
      await Promise.all([
        queryClient.ensureQueryData(
          collectionQueryOptions(params.collectionId)
        ),
        queryClient.ensureInfiniteQueryData(
          collectionInfiniteQueryOptions(params.collectionId)
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
