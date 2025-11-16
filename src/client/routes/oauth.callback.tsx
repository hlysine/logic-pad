import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { api } from '../online/api';
import { useEffect } from 'react';
import { useOnline } from '../contexts/OnlineContext';
import Loading from '../components/Loading';
import deferredRedirect from '../router/deferredRedirect';

function OAuthCallback() {
  const online = useOnline();
  const navigate = useNavigate();
  useEffect(() => {
    void (async () => {
      await online.refresh();
      if (!(await deferredRedirect.execute())) {
        await navigate({ to: '/' });
      }
    })();
  }, [online, navigate]);
  return <Loading />;
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
    } catch {}
  },
});
