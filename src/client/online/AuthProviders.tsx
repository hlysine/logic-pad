import { memo } from 'react';
import { IconType } from 'react-icons';
import { api } from './api';
import { FaDiscord, FaGoogle } from 'react-icons/fa';

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

export default memo(function AuthProviders() {
  return (
    <div className="justify-end card-actions flex-col gap-4 w-full">
      <AuthButton
        provider="google"
        label="Continue with Google"
        icon={FaGoogle}
      />
      <AuthButton
        provider="discord"
        label="Continue with Discord"
        icon={FaDiscord}
      />
      <p>More providers coming soon</p>
    </div>
  );
});
