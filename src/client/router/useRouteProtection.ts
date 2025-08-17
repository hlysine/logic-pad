import { useEffect } from 'react';
import { useOnline } from '../contexts/OnlineContext';
import { useNavigate, useRouterState } from '@tanstack/react-router';
import deferredRedirect from './deferredRedirect';

export const useRouteProtection = (level: 'online' | 'login') => {
  const { isOnline, me, isPending } = useOnline();
  const routerState = useRouterState();
  const navigate = useNavigate();
  useEffect(() => {
    if (isPending) return;
    if (level === 'online' && !isOnline) {
      void navigate({ to: '/' });
    } else if (level === 'login' && !me) {
      if (isOnline) {
        void deferredRedirect.setAndNavigate(routerState.location, {
          to: '/auth',
        });
      } else {
        void navigate({ to: '/' });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPending]);
};
