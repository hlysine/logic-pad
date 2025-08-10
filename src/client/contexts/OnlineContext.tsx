import { useQuery } from '@tanstack/react-query';
import { createContext, memo, use, useMemo } from 'react';
import { api } from '../online/api';
import { UserBrief } from '../online/data';
import { useSettings } from './SettingsContext';

const defaultOnline = true;

export interface OnlineContext {
  /**
   * True if the server is reachable.
   */
  isOnline: boolean;
  /**
   * The current user, or null if not logged in or offline.
   */
  me: UserBrief | null;
  /**
   * Refresh the online status and user data.
   */
  refresh: () => Promise<void>;
}

const Context = createContext<OnlineContext>({
  isOnline: defaultOnline,
  me: null,
  refresh: async () => {},
});

export const useOnline = () => {
  return use(Context);
};

export const OnlineConsumer = Context.Consumer;

export default memo(function OnlineContext({
  children,
  forceOffline,
}: {
  children: React.ReactNode;
  forceOffline?: boolean;
}) {
  forceOffline ??= false;
  const [offlineMode] = useSettings('offlineMode');

  const onlineQuery = useQuery({
    queryKey: ['isOnline'],
    queryFn: api.isOnline,
    enabled: !forceOffline && !offlineMode,
  });

  const meQuery = useQuery({
    queryKey: ['me'],
    queryFn: api.getMe,
    enabled:
      !forceOffline && !offlineMode && (onlineQuery.data ?? defaultOnline),
  });

  const value = useMemo(
    () => ({
      isOnline:
        !forceOffline && !offlineMode && (onlineQuery.data ?? defaultOnline),
      me: meQuery.data ?? null,
      refresh: async () => {
        await onlineQuery.refetch();
        await meQuery.refetch();
      },
    }),
    [forceOffline, offlineMode, onlineQuery, meQuery]
  );

  return <Context value={value}>{children}</Context>;
});
