import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_layout/my-stuff/')({
  beforeLoad: () => {
    throw redirect({ to: '/my-stuff/puzzles' });
  },
});
