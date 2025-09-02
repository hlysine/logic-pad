import { createFileRoute, redirect } from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-adapter';
import {
  PuzzleSearchParams,
  puzzleSearchSchema,
} from '../online/PuzzleSearchQuery';
import { api, bidirectionalInfiniteQuery, queryClient } from '../online/api';
import { router } from '../main';
import toast from 'react-hot-toast';

export const myPuzzlesInfiniteQueryOptions = (search: PuzzleSearchParams) =>
  bidirectionalInfiniteQuery(
    ['user', 'me', 'puzzles', search],
    (cursorBefore, cursorAfter) =>
      api.listMyPuzzles(search, cursorBefore, cursorAfter)
  );

export const Route = createFileRoute('/_layout/my-stuff/puzzles')({
  validateSearch: zodValidator(puzzleSearchSchema),
  loader: async () => {
    try {
      await Promise.all([
        queryClient.ensureInfiniteQueryData(
          myPuzzlesInfiniteQueryOptions(router.state.location.search)
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
