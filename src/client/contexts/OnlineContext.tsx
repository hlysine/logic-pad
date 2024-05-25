import { useQuery } from '@tanstack/react-query';
import { createContext, memo, useContext } from 'react';
import api from '../online/api';

export interface OnlineContext {
  isOnline: boolean | undefined;
}

const context = createContext<OnlineContext>({ isOnline: undefined });

export const useOnline = () => {
  return useContext(context);
};

export const OnlineConsumer = context.Consumer;

export const OnlineOnly = ({
  children,
  fallback,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) => {
  const { isOnline } = useOnline();

  return isOnline ? <>{children}</> : fallback;
};

export default memo(function OnlineContext({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isSuccess, isPending } = useQuery({
    queryKey: ['ping'],
    queryFn: api.ping,
  });

  return (
    <context.Provider
      value={{
        isOnline: isPending ? undefined : isSuccess,
      }}
    >
      {children}
    </context.Provider>
  );
});
