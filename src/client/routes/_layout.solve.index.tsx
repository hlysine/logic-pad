import { createFileRoute } from '@tanstack/react-router';
import { validateSearch } from '../router/linkLoader';

export const Route = createFileRoute('/_layout/solve/')({
  validateSearch,
});
