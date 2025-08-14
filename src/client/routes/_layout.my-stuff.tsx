import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_layout/my-stuff')({
  beforeLoad: ({ context }) => {
    if (!context.isOnline || !context.me) {
      throw redirect({
        to: '/',
      });
    }
  },
});
