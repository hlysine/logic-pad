import { createFileRoute, redirect } from '@tanstack/react-router';
import { queryOptions } from '@tanstack/react-query';
import { api, queryClient } from '../online/api';
import toast from 'react-hot-toast';

export const supporterPricesQueryOptions = queryOptions({
  queryKey: ['supporter', 'prices'],
  queryFn: () => api.listSupporterPrices(),
});

export const Route = createFileRoute('/_layout/support')({
  loader: async () => {
    try {
      await queryClient.ensureQueryData(supporterPricesQueryOptions);
    } catch (error) {
      toast.error((error as Error).message);
      throw redirect({
        to: '/',
      });
    }
  },
});
