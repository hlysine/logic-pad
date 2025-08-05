import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { api } from '../online/api';
import { useEffect } from 'react';
import { useOnline } from '../contexts/OnlineContext';

function OAuthCallback() {
  const online = useOnline();
  const navigate = useNavigate();
  useEffect(() => {
    void online.refresh();
    void navigate({ to: '/' });
  }, [online, navigate]);
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
    } catch (_ex) {}
  },
});
