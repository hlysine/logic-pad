import { createFileRoute, redirect } from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-adapter';
import {
  PuzzleSearchParams,
  puzzleSearchSchema,
} from '../online/PuzzleSearchQuery';
import { api, bidirectionalInfiniteQuery, queryClient } from '../online/api';
import { router } from '../main';
import toast from 'react-hot-toast';

export const searchPuzzlesInfiniteQueryOptions = (search: PuzzleSearchParams) =>
  bidirectionalInfiniteQuery(
    ['puzzle', 'search', search],
    (cursorBefore, cursorAfter) =>
      api.searchPuzzles(search, cursorBefore, cursorAfter)
  );

export const Route = createFileRoute('/_layout/search/puzzles')({
  validateSearch: zodValidator(puzzleSearchSchema),
  loader: async () => {
    try {
      await Promise.all([
        queryClient.ensureInfiniteQueryData(
          searchPuzzlesInfiniteQueryOptions(router.state.location.search)
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
