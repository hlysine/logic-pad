import { createFileRoute } from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-adapter';
import { collectionSearchSchema } from '../online/CollectionSearchQuery';

export const Route = createFileRoute('/_layout/my-stuff/collections')({
  validateSearch: zodValidator(collectionSearchSchema),
});
