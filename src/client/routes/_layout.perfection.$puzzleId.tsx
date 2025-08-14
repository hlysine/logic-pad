import { createFileRoute, redirect } from '@tanstack/react-router';
import { queryClient } from '../online/api';
import toast from 'react-hot-toast';
import { puzzleSolveQueryOptions } from './_layout.solve.$puzzleId';

export const Route = createFileRoute('/_layout/perfection/$puzzleId')({
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
