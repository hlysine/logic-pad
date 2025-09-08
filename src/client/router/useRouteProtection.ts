import { useEffect } from 'react';
import { useOnline } from '../contexts/OnlineContext';
import { useNavigate } from '@tanstack/react-router';
import deferredRedirect from './deferredRedirect';
import toast from 'react-hot-toast';
import { router } from './router';

export const useRouteProtection = (level: 'online' | 'login') => {
  const { isOnline, me, isPending } = useOnline();
  const navigate = useNavigate();
  useEffect(() => {
    if (isPending) return;
    if (level === 'online' && !isOnline) {
      toast.error('You have to be online to access this page');
      void navigate({ to: '/', replace: true });
    } else if (level === 'login' && (!isOnline || !me)) {
      if (isOnline) {
        toast.error('You have to log in to access this page');
        void deferredRedirect.setAndNavigate(router.state.location, {
          to: '/auth',
          replace: true,
        });
      } else {
        toast.error('You have to be online to access this page');
        void navigate({ to: '/', replace: true });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPending]);
};
