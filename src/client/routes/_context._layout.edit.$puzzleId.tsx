import { createFileRoute } from '@tanstack/react-router';
import { queryOptions } from '@tanstack/react-query';
import { api, queryClient } from '../online/api';

export const puzzleQueryOptions = (puzzleId: string) =>
  queryOptions({
    queryKey: ['puzzle', puzzleId],
    queryFn: () => api.getPuzzleFull(puzzleId),
  });

export const Route = createFileRoute('/_context/_layout/edit/$puzzleId')({
  loader: ({ params }) =>
    queryClient.ensureQueryData(puzzleQueryOptions(params.puzzleId)),
});
