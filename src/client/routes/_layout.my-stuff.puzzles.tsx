import { createFileRoute, redirect } from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-adapter';
import {
  PrivatePuzzleSearchParams,
  privatePuzzleSearchSchema,
} from '../online/PuzzleSearchQuery';
import { api, bidirectionalInfiniteQuery, queryClient } from '../online/api';
import { router } from '../main';
import toast from 'react-hot-toast';

export const myPuzzlesInfiniteQueryOptions = (
  search: PrivatePuzzleSearchParams
) =>
  bidirectionalInfiniteQuery(
    ['user', 'me', 'puzzles', search],
    (cursorBefore, cursorAfter) =>
      api.listMyPuzzles(search, cursorBefore, cursorAfter)
  );

export const Route = createFileRoute('/_layout/my-stuff/puzzles')({
  validateSearch: zodValidator(privatePuzzleSearchSchema),
  loader: async () => {
    try {
      await Promise.all([
        queryClient.ensureInfiniteQueryData(
          myPuzzlesInfiniteQueryOptions(
            router.state.location.search as PrivatePuzzleSearchParams
          )
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
