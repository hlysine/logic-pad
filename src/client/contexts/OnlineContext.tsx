import { useQuery } from '@tanstack/react-query';
import { createContext, memo, useContext } from 'react';
import api from '../online/api';

interface OnlineContext {
  isOnline: boolean;
}

const context = createContext<OnlineContext>({ isOnline: false });

export const useOnline = () => {
  return useContext(context);
};

export const OnlineConsumer = context.Consumer;

export default memo(function OnlineContext({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isSuccess } = useQuery({
    queryKey: ['repoData'],
    queryFn: api.ping,
  });

  return (
    <context.Provider
      value={{
        isOnline: isSuccess,
      }}
    >
      {children}
    </context.Provider>
  );
});
