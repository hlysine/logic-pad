import { useEffect } from 'react';
import { useOnline } from '../contexts/OnlineContext';
import { useNavigate, useRouterState } from '@tanstack/react-router';
import deferredRedirect from './deferredRedirect';
import toast from 'react-hot-toast';

export const useRouteProtection = (level: 'online' | 'login') => {
  const { isOnline, me, isPending } = useOnline();
  const routerState = useRouterState();
  const navigate = useNavigate();
  useEffect(() => {
    if (isPending) return;
    if (level === 'online' && !isOnline) {
      toast.error('You have to be online to access this page');
      void navigate({ to: '/' });
    } else if (level === 'login' && !me) {
      if (isOnline) {
        toast.error('You have to log in to access this page');
        void deferredRedirect.setAndNavigate(routerState.location, {
          to: '/auth',
        });
      } else {
        toast.error('You have to be online to access this page');
        void navigate({ to: '/' });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPending]);
};
