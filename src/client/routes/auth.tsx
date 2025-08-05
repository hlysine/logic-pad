import { Link, createFileRoute } from '@tanstack/react-router';
import { api } from '../online/api';
import { FaDiscord, FaGoogle } from 'react-icons/fa';
import { IconType } from 'react-icons';

interface AuthButtonProps {
  provider: string;
  label: string;
  icon: IconType;
}

function AuthButton({ provider, label, icon: Icon }: AuthButtonProps) {
  return (
    <button
      className="btn btn-outline font-thin text-lg w-full"
      onClick={() => {
        api.signInWithOAuth(
          provider,
          window.location.origin + '/oauth/callback',
          window.location.origin
        );
      }}
    >
      {<Icon size={24} />}
      {label}
    </button>
  );
}

function Auth() {
  return (
    <div className="flex items-center justify-center w-full h-full min-h-screen">
      <div className="card bg-base-100 card-lg shadow-sm overflow-hidden max-w-full w-[500px] m-4">
        <div className="bg-base-200 p-4">
          <Link
            to="/"
            className="text-xl text-neutral-content flex items-center gap-2"
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
          <div className="justify-end card-actions flex-col gap-4 w-full">
            <AuthButton
              provider="google"
              label="Sign in with Google"
              icon={FaGoogle}
            />
            <AuthButton
              provider="discord"
              label="Sign in with Discord"
              icon={FaDiscord}
            />
            <p>More providers coming soon</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute('/auth')({
  component: Auth,
});
