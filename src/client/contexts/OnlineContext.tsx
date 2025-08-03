import { useQuery } from '@tanstack/react-query';
import { createContext, memo, useContext, useMemo } from 'react';
import { api } from '../online/api';

const defaultOnline = true;

export interface OnlineContext {
  isOnline: boolean;
}

const context = createContext<OnlineContext>({
  isOnline: defaultOnline,
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

  const value = useMemo(
    () => ({
      isOnline: onlineQuery.data ?? defaultOnline,
    }),
    [onlineQuery.data]
  );

  return <context.Provider value={value}>{children}</context.Provider>;
});
