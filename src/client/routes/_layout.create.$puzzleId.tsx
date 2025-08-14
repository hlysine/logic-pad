import { createFileRoute, redirect } from '@tanstack/react-router';
import { queryOptions } from '@tanstack/react-query';
import { api, queryClient } from '../online/api';
import toast from 'react-hot-toast';

export const puzzleEditQueryOptions = (puzzleId: string | null) =>
  queryOptions({
    queryKey: ['puzzle', 'edit', puzzleId],
    queryFn: () => api.getPuzzleFullForEdit(puzzleId!),
    enabled: !!puzzleId,
  });

export const Route = createFileRoute('/_layout/create/$puzzleId')({
  beforeLoad: ({ context }) => {
    if (!context.isOnline) {
      throw redirect({
        to: '/',
      });
    }
  },
  loader: async ({ params }) => {
    try {
      return await queryClient.ensureQueryData(
        puzzleEditQueryOptions(params.puzzleId)
      );
    } catch (error) {
      toast.error((error as Error).message);
      throw redirect({
        to: '/create',
      });
    }
  },
});
