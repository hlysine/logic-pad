import { Link, createFileRoute, useNavigate } from '@tanstack/react-router';
import { useOnline } from '../contexts/OnlineContext';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import deferredRedirect from '../router/deferredRedirect';
import AuthProviders from '../online/AuthProviders';

export const Route = createFileRoute('/auth')({
  component: function Auth() {
    const { isOnline, me } = useOnline();
    const navigate = useNavigate();
    useEffect(() => {
      void (async () => {
        if (!isOnline) {
          toast.error('Failed to sign in because you are offline');
          await navigate({ to: '/' });
        }
        if (me) {
          toast.success('Signed in automatically');
          if (!(await deferredRedirect.execute())) {
            await navigate({ to: '/' });
          }
        }
      })();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOnline, me]);
    return (
      <div className="flex items-center justify-center w-full h-full min-h-screen">
        <div className="card bg-base-100 card-lg shadow-sm overflow-hidden max-w-full w-[500px] m-4">
          <div className="bg-base-200 p-4">
            <Link
              to="/"
              className="text-xl text-neutral-content flex items-center gap-2 font-serif"
            >
              <img
                src="/logo.svg"
                className="w-8 h-8 inline-block"
                alt="Logic Pad logo"
              />
              Logic Pad
            </Link>
          </div>
          <div className="card-body gap-8">
            <div>
              <h2 className="card-title font-thin text-3xl">
                Continue with an account
              </h2>
              <p className="text-lg">Sign in or sign up here</p>
            </div>
            <AuthProviders />
          </div>
        </div>
      </div>
    );
  },
});
