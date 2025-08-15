import { createLazyFileRoute } from '@tanstack/react-router';
import { memo, useEffect, useState } from 'react';
import TopBottomLayout from '../components/TopBottomLayout';
import { useOnline } from '../contexts/OnlineContext';
import { useMutation } from '@tanstack/react-query';
import { api, queryClient } from '../online/api';
import Loading from '../components/Loading';
import toast from 'react-hot-toast';
import { UserBrief } from '../online/data';
import { useRouteProtection } from '../router/useRouteProtection';

const AccountSettings = memo(function AccountSettings() {
  useRouteProtection('login');
  const { me, refresh } = useOnline();

  const updateMe = useMutation({
    mutationFn: api.updateMe,
    onMutate: async variables => {
      await queryClient.cancelQueries({ queryKey: ['me'] });
      queryClient.setQueryData(['me'], (old: UserBrief) => ({
        ...old,
        name: variables.name,
      }));
      return { me };
    },
    onError(error, _, context) {
      toast.error(error.message);
      queryClient.setQueryData(['me'], context?.me);
    },
    onSettled: async () => {
      await refresh();
    },
  });

  const [username, setUsername] = useState(me?.name ?? '');

  useEffect(() => {
    setUsername(me?.name ?? '');
  }, [me]);

  if (!me) return null;
  return (
    <div className="flex gap-4 flex-wrap p-2">
      <div className="text-2xl font-semibold w-96 max-w-full shrink-0">
        Account
      </div>
      <div className="flex flex-col gap-4 min-w-96 grow">
        <label className="form-control w-full shrink-0">
          <div className="label">
            <span className="label-text text-lg">Username</span>
            <span className="label-text-alt">{username.length}/128</span>
          </div>
          <input
            type="text"
            placeholder="Type here"
            className="input input-bordered w-full"
            maxLength={128}
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
        </label>
        {updateMe.isPending ? (
          <Loading className="self-end w-fit" />
        ) : (
          <button
            className="btn btn-primary self-end max-w-xs"
            onClick={async () => {
              await updateMe.mutateAsync({ name: username });
            }}
          >
            Save
          </button>
        )}
      </div>
    </div>
  );
});

export const Route = createLazyFileRoute('/_layout/settings')({
  component: memo(function Settings() {
    return (
      <TopBottomLayout
        top={
          <>
            <div className="text-3xl mt-8">Settings</div>
            <div>Work in progress</div>
          </>
        }
      >
        <AccountSettings />
      </TopBottomLayout>
    );
  }),
});
