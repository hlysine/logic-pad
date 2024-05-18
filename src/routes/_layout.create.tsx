import { createFileRoute } from '@tanstack/react-router';
import { validateSearch } from '../ui/router/linkLoader';

export const Route = createFileRoute('/_layout/create')({
  validateSearch,
});
