import { useQuery } from '@tanstack/react-query';
import { createContext, memo, useContext, useMemo } from 'react';
import { api } from '../online/api';
import { UserBrief } from '../online/data';

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
}

const context = createContext<OnlineContext>({
  isOnline: defaultOnline,
  me: null,
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
      isOnline: onlineQuery.data ?? defaultOnline,
      me: meQuery.data ?? null,
    }),
    [onlineQuery.data, meQuery.data]
  );

  return <context.Provider value={value}>{children}</context.Provider>;
});
