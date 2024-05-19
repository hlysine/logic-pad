import { createFileRoute } from '@tanstack/react-router';
import { validateSearch } from '../ui/router/linkLoader';

export const Route = createFileRoute('/_context/_layout/create')({
  validateSearch,
});
