import { createFileRoute, redirect } from '@tanstack/react-router';
import { queryOptions } from '@tanstack/react-query';
import { api, queryClient } from '../online/api';

export const puzzleQueryOptions = (puzzleId: string) =>
  queryOptions({
    queryKey: ['puzzle', puzzleId],
    queryFn: () => api.getPuzzleFullForEdit(puzzleId),
    enabled: puzzleId.length > 0,
  });

export const Route = createFileRoute('/_context/_layout/edit/$puzzleId')({
  loader: async ({ params }) => {
    try {
      return await queryClient.ensureQueryData(
        puzzleQueryOptions(params.puzzleId)
      );
    } catch (error) {
      throw redirect({
        to: '/create',
      });
    }
  },
});
