import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_layout/search/')({
  beforeLoad: () => {
    throw redirect({ to: '/search/puzzles' });
  },
});
