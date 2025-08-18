import { createFileRoute, redirect } from '@tanstack/react-router';
import { queryOptions } from '@tanstack/react-query';
import { api, queryClient } from '../online/api';
import toast from 'react-hot-toast';

export const userBriefQueryOptions = (userId: string) =>
  queryOptions({
    queryKey: ['profile', userId],
    queryFn: () => api.getUser(userId),
  });

export const userDetailQueryOptions = (userId: string) =>
  queryOptions({
    queryKey: ['profile', userId, 'detail'],
    queryFn: () => api.getUserDetail(userId),
  });

export const Route = createFileRoute('/_layout/profile/$userId')({
  remountDeps: ({ params }) => params.userId,
  loader: async ({ params }) => {
    try {
      await queryClient.ensureQueryData(userBriefQueryOptions(params.userId));
      await queryClient.ensureQueryData(userDetailQueryOptions(params.userId));
    } catch (error) {
      toast.error((error as Error).message);
      throw redirect({
        to: '/',
      });
    }
  },
});
