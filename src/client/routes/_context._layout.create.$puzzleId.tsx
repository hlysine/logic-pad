import { createFileRoute, redirect } from '@tanstack/react-router';
import { queryOptions } from '@tanstack/react-query';
import { api, queryClient } from '../online/api';
import toast from 'react-hot-toast';

export const puzzleQueryOptions = (puzzleId: string) =>
  queryOptions({
    queryKey: ['puzzle', puzzleId],
    queryFn: () => api.getPuzzleFullForEdit(puzzleId),
    enabled: puzzleId.length > 0,
  });

export const Route = createFileRoute('/_context/_layout/create/$puzzleId')({
  loader: async ({ params }) => {
    try {
      return await queryClient.ensureQueryData(
        puzzleQueryOptions(params.puzzleId)
      );
    } catch (error) {
      toast.error((error as Error).message);
      throw redirect({
        to: '/create',
      });
    }
  },
});
