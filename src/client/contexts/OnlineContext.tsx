import { useQuery } from '@tanstack/react-query';
import { createContext, memo, use, useEffect, useMemo } from 'react';
import { api } from '../online/api';
import { UserBrief } from '../online/data';
import { useSettings } from './SettingsContext';
import semverSatisfies from 'semver/functions/satisfies';
import toast from 'react-hot-toast';

const defaultOnline = true;
const apiVersionRange = '1.x';

export interface OnlineContext {
  /**
   * True if the server is reachable.
   */
  isOnline: boolean;
  /**
   * True if the server is reachable but the API version is incompatible.
   */
  versionMismatch: boolean;
  /**
   * The current user, or null if not logged in or offline.
   */
  me: UserBrief | null;
  /**
   * Whether the online status or user data is currently being fetched.
   */
  isPending: boolean;
  /**
   * Refresh the online status and user data.
   */
  refresh: () => Promise<void>;
}

const Context = createContext<OnlineContext>({
  isOnline: defaultOnline,
  versionMismatch: false,
  me: null,
  isPending: false,
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

  const onlineResult = useMemo(() => {
    let apiOnline = defaultOnline;
    let versionMismatch = false;
    if (onlineQuery.data) {
      if (semverSatisfies(onlineQuery.data.version, apiVersionRange)) {
        apiOnline = true;
      } else {
        apiOnline = false;
        versionMismatch = true;
      }
    } else if (onlineQuery.data === null) {
      apiOnline = false;
    }
    return {
      isOnline: !forceOffline && !offlineMode && apiOnline,
      versionMismatch,
    };
  }, [forceOffline, offlineMode, onlineQuery]);

  useEffect(() => {
    if (onlineResult.versionMismatch) {
      const toastId = toast.error(
        'This web app is out of date. Please update to go online.'
      );
      return () => {
        toast.dismiss(toastId);
      };
    }
  }, [onlineResult.versionMismatch]);

  const meQuery = useQuery({
    queryKey: ['me'],
    queryFn: api.getMe,
    enabled: onlineResult.isOnline,
  });

  const value = useMemo(
    () => ({
      ...onlineResult,
      me: meQuery.data ?? null,
      isPending: onlineQuery.isLoading || meQuery.isLoading,
      refresh: async () => {
        await onlineQuery.refetch();
        await meQuery.refetch();
      },
    }),
    [onlineResult, onlineQuery, meQuery]
  );

  return <Context value={value}>{children}</Context>;
});
