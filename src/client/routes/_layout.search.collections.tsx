import { createFileRoute } from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-adapter';
import { collectionSearchSchema } from '../online/CollectionSearchQuery';

export const Route = createFileRoute('/_layout/search/collections')({
  validateSearch: zodValidator(collectionSearchSchema),
});
