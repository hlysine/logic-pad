import { useQuery } from '@tanstack/react-query';
import { createContext, memo, useContext, useMemo } from 'react';
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

const context = createContext<OnlineContext>({
  isOnline: defaultOnline,
  me: null,
  refresh: async () => {},
});

export const useOnline = () => {
  return useContext(context);
};

export const OnlineConsumer = context.Consumer;

export default memo(function OnlineContext({
  children,
}: {
  children: React.ReactNode;
}) {
  const [offlineMode] = useSettings('offlineMode');

  const onlineQuery = useQuery({
    queryKey: ['isOnline'],
    queryFn: api.isOnline,
  });

  const meQuery = useQuery({
    queryKey: ['me'],
    queryFn: api.getMe,
    enabled: onlineQuery.data ?? defaultOnline,
  });

  const value = useMemo(
    () => ({
      isOnline: !offlineMode && (onlineQuery.data ?? defaultOnline),
      me: meQuery.data ?? null,
      refresh: async () => {
        await onlineQuery.refetch();
        await meQuery.refetch();
      },
    }),
    [offlineMode, onlineQuery, meQuery]
  );

  return <context.Provider value={value}>{children}</context.Provider>;
});
