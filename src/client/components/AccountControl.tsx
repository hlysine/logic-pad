import { memo, useState } from 'react';
import { useOnline } from '../contexts/OnlineContext';
import { IoCloudOffline } from 'react-icons/io5';
import { cn } from '../uiHelper';
import { FaGoogle } from 'react-icons/fa';
import { api } from '../online/api';
import { useQuery } from '@tanstack/react-query';
import Loading from './Loading';

export default memo(function AccountControl() {
  const { isOnline, me } = useOnline();
  const [open, setOpen] = useState(false);
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
          onClick={() => setOpen(true)}
        >
          Sign in / sign up
        </div>
        <dialog id="auth_modal" className={cn('modal', open && 'modal-open')}>
          <div className="modal-box flex flex-col gap-4 items-center">
            <h3 className="font-bold text-2xl">Continue with an account</h3>
            <p>Support for more providers coming soon</p>
            <button
              className="btn btn-primary btn-outline btn-md w-full gap-4"
              onClick={() =>
                api.signInWithOAuth(
                  'google',
                  window.location.origin + '/oauth/callback',
                  window.location.origin
                )
              }
            >
              <FaGoogle size={24} />
              Sign in with Google
            </button>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button onClick={() => setOpen(false)}>close</button>
          </form>
        </dialog>
      </>
    );
  }
  return (
    <div className="btn btn-square ms-4 px-4 flex-shrink-0 w-fit">
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
    </div>
  );
});
