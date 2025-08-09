import { createFileRoute } from '@tanstack/react-router';
import { validateSearch } from '../router/linkLoader';

export const Route = createFileRoute('/_context/_layout/create/')({
  validateSearch,
});
