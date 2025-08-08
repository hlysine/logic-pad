import { memo } from 'react';
import { useOnline } from '../contexts/OnlineContext';
import { IoCloudOffline } from 'react-icons/io5';
import { api } from '../online/api';
import { useQuery } from '@tanstack/react-query';
import Loading from './Loading';
import { useRouterState } from '@tanstack/react-router';
import deferredRedirect from '../router/deferredRedirect';

export default memo(function AccountControl() {
  const { isOnline, me, refresh } = useOnline();
  const routerState = useRouterState();
  const avatarQuery = useQuery({
    queryKey: ['avatar', me?.id],
    queryFn: () => (me ? api.getAvatar(me.id) : null),
    enabled: !!me,
  });
  if (!isOnline) {
    return (
      <div className="btn btn-square btn-disabled ms-4 px-4 flex-shrink-0 w-fit">
        <IoCloudOffline />
        Offline
      </div>
    );
  }
  if (!me) {
    return (
      <>
        <div
          className="btn btn-square ms-4 px-4 flex-shrink-0 w-fit"
          onClick={async () => {
            await deferredRedirect.setAndNavigate(routerState.location, {
              to: '/auth',
            });
          }}
        >
          Sign in / sign up
        </div>
      </>
    );
  }
  return (
    <details className="dropdown dropdown-end">
      <summary className="btn btn-square ms-4 px-4 flex-shrink-0 w-fit">
        {avatarQuery.isSuccess ? (
          <img
            src={avatarQuery.data ?? undefined}
            alt="Avatar"
            className="w-8 h-8 rounded-full"
          />
        ) : (
          <Loading className="w-8 h-8" />
        )}
        {me.name}
      </summary>
      <ul className="menu dropdown-content bg-base-100 rounded-box z-50 w-52 mt-2 p-2 shadow-sm">
        <li>
          <a>Profile</a>
        </li>
        <li>
          <a>My stuff</a>
        </li>
        <li>
          <a
            onClick={async () => {
              await api.logout();
              await refresh();
            }}
          >
            Logout
          </a>
        </li>
      </ul>
    </details>
  );
});
