import { memo, useRef } from 'react';
import { useOnline } from '../contexts/OnlineContext';
import { IoCloudOffline } from 'react-icons/io5';
import { api } from '../online/api';
import { queryOptions, useQuery } from '@tanstack/react-query';
import Loading from './Loading';
import { Link, useRouterState } from '@tanstack/react-router';
import deferredRedirect from '../router/deferredRedirect';
import { FaBan } from 'react-icons/fa';

export const avatarQueryOptions = (userId: string | null) =>
  queryOptions({
    queryKey: ['avatar', userId],
    queryFn: () => (userId ? api.getAvatar(userId) : null),
    enabled: !!userId,
    staleTime: Infinity,
  });

// million-ignore
export default memo(function AccountControl() {
  const { isOnline, me, isPending, refresh } = useOnline();
  const location = useRouterState({ select: s => s.location });
  const avatarQuery = useQuery(avatarQueryOptions(me?.id ?? null));
  const detailsRef = useRef<HTMLDetailsElement>(null);
  if (!isOnline) {
    return (
      <div className="btn btn-square btn-disabled ms-4 px-4 flex-shrink-0 w-fit">
        <IoCloudOffline />
        Offline
      </div>
    );
  }
  if (isPending) {
    <button className="btn btn-square ms-4 px-4 flex-shrink-0 w-fit">
      <Loading className="w-8 h-8" />
    </button>;
  }
  if (!me) {
    if (location.pathname === '/create') {
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
            await deferredRedirect.setAndNavigate(location, {
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
    <details ref={detailsRef} className="dropdown dropdown-end">
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
      <ul className="menu dropdown-content bg-base-300 text-base-content rounded-box z-50 w-52 mt-2 p-2 shadow-lg">
        <li>
          <Link
            to={'/profile/' + me.id}
            onClick={() => (detailsRef.current!.open = false)}
          >
            Profile
          </Link>
        </li>
        <li>
          <Link
            to="/my-stuff"
            onClick={() => (detailsRef.current!.open = false)}
          >
            My stuff
          </Link>
        </li>
        <li>
          <Link
            to="/settings"
            onClick={() => (detailsRef.current!.open = false)}
          >
            Settings
          </Link>
        </li>
        <li>
          <a
            onClick={async () => {
              await api.logout();
              await refresh();
              detailsRef.current!.open = false;
            }}
          >
            Logout
          </a>
        </li>
      </ul>
    </details>
  );
});
