import { createFileRoute, redirect } from '@tanstack/react-router';
import { infiniteQueryOptions, queryOptions } from '@tanstack/react-query';
import { api, queryClient } from '../online/api';
import toast from 'react-hot-toast';

export const collectionQueryOptions = (collectionId: string | null) =>
  queryOptions({
    queryKey: ['collection', collectionId],
    queryFn: () => api.getCollectionBrief(collectionId!),
    enabled: !!collectionId,
  });

export const collectionInfiniteQueryOptions = (collectionId: string | null) =>
  infiniteQueryOptions({
    queryKey: ['collection', collectionId, 'puzzles'],
    queryFn: ({ pageParam }: { pageParam: string | undefined }) => {
      return api.listCollectionPuzzles(collectionId!, pageParam);
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
    retry: false,
    throwOnError(error) {
      toast.error(error.message);
      return false;
    },
    staleTime: 1000 * 60,
    enabled: !!collectionId,
  });

export const Route = createFileRoute('/_layout/collection/$collectionId')({
  loader: async ({ params }) => {
    try {
      await queryClient.ensureQueryData(
        collectionQueryOptions(params.collectionId)
      );
      await queryClient.ensureInfiniteQueryData(
        collectionInfiniteQueryOptions(params.collectionId)
      );
    } catch (error) {
      toast.error((error as Error).message);
      throw redirect({
        to: '/',
      });
    }
  },
});
