import { memo } from 'react';
import { useOnline } from '../contexts/OnlineContext';
import { IoCloudOffline } from 'react-icons/io5';
import { api } from '../online/api';
import { queryOptions, useQuery } from '@tanstack/react-query';
import Loading from './Loading';
import { Link, useRouterState } from '@tanstack/react-router';
import deferredRedirect from '../router/deferredRedirect';
import { FaBan } from 'react-icons/fa';
import { UserBrief } from '../online/data';

export const avatarQueryOptions = (user: UserBrief | null) =>
  queryOptions({
    queryKey: ['avatar', user?.id],
    queryFn: () => (user ? api.getAvatar(user.id) : null),
    enabled: !!user,
    staleTime: Infinity,
  });

// million-ignore
export default memo(function AccountControl() {
  const { isOnline, me, refresh } = useOnline();
  const routerState = useRouterState();
  const avatarQuery = useQuery(avatarQueryOptions(me));
  if (!isOnline) {
    return (
      <div className="btn btn-square btn-disabled ms-4 px-4 flex-shrink-0 w-fit">
        <IoCloudOffline />
        Offline
      </div>
    );
  }
  if (!me) {
    if (routerState.location.pathname === '/create') {
      // Disable button in create mode because this loses puzzle data
      // users should sign in via the online panel instead
      return (
        <>
          <div className="btn btn-square btn-disabled ms-4 px-4 flex-shrink-0 w-fit">
            <FaBan />
            Not signed in
          </div>
        </>
      );
    }
    return (
      <>
        <button
          className="btn btn-square ms-4 px-4 flex-shrink-0 w-fit"
          onClick={async () => {
            await deferredRedirect.setAndNavigate(routerState.location, {
              to: '/auth',
            });
          }}
        >
          Sign in / sign up
        </button>
      </>
    );
  }
  return (
    <details className="dropdown dropdown-end">
      <summary className="btn btn-square ms-4 px-4 flex-shrink-0 w-fit">
        {avatarQuery.isSuccess ? (
          <img
            src={avatarQuery.data ?? undefined}
            alt={`${me.name}'s avatar`}
            className="w-8 h-8 rounded-full"
          />
        ) : (
          <Loading className="w-8 h-8" />
        )}
        {me.name}
      </summary>
      <ul className="menu dropdown-content bg-base-300 rounded-box z-50 w-52 mt-2 p-2 shadow-lg">
        <li>
          <a className="opacity-50">Profile</a>
        </li>
        <li>
          <Link to="/my-stuff">My stuff</Link>
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
