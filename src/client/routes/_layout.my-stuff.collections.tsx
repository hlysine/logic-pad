import { createFileRoute, redirect } from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-adapter';
import {
  CollectionSearchParams,
  collectionSearchSchema,
} from '../online/CollectionSearchQuery';
import { queryClient } from '../online/api';
import toast from 'react-hot-toast';
import { router } from '../router/router';
import { searchOwnCollectionsInfiniteQueryOptions } from '../online/CollectionSearchResults';

export const Route = createFileRoute('/_layout/my-stuff/collections')({
  validateSearch: zodValidator(collectionSearchSchema),
  loader: async () => {
    try {
      await Promise.all([
        queryClient.ensureInfiniteQueryData(
          searchOwnCollectionsInfiniteQueryOptions(
            router.state.location.search as CollectionSearchParams
          )
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
