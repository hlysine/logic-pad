import { createFileRoute, redirect } from '@tanstack/react-router';
import { api } from '../online/api';

function OAuthCallback() {
  return <div>Redirecting...</div>;
}

export const Route = createFileRoute('/oauth/callback')({
  component: OAuthCallback,
  beforeLoad: async ({ location }) => {
    const { userId, secret } = location.search as {
      userId?: string;
      secret?: string;
    };
    if (!userId || !secret) {
      throw new Error('Invalid parameters for OAuth callback');
    }
    try {
      await api.callbackOAuth(userId, secret);
    } finally {
      // eslint-disable-next-line @typescript-eslint/only-throw-error, no-unsafe-finally
      throw redirect({ to: '/' });
    }
  },
});
