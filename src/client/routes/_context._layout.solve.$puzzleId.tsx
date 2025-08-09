import { createFileRoute, redirect } from '@tanstack/react-router';
import { queryOptions } from '@tanstack/react-query';
import { api, queryClient } from '../online/api';
import toast from 'react-hot-toast';

export const puzzleSolveQueryOptions = (puzzleId: string) =>
  queryOptions({
    queryKey: ['puzzle', 'solve', puzzleId],
    queryFn: () => api.getPuzzleFullForSolve(puzzleId),
    enabled: puzzleId.length > 0,
  });

export const Route = createFileRoute('/_context/_layout/solve/$puzzleId')({
  loader: async ({ params }) => {
    try {
      return await queryClient.ensureQueryData(
        puzzleSolveQueryOptions(params.puzzleId)
      );
    } catch (error) {
      toast.error((error as Error).message);
      throw redirect({
        to: '/',
      });
    }
  },
});
