import { memo, RefObject } from 'react';
import { useMutation } from '@tanstack/react-query';
import { api, queryClient } from '../api';
import toast from 'react-hot-toast';
import { cn } from '../../uiHelper';
import { modPrompt, PromptHandle } from './ModMessagePrompt';

export interface UserStatusProps {
  userId: string;
  status: boolean | undefined;
  promptHandle: RefObject<PromptHandle | null>;
}

export default memo(function UserStatus({
  userId,
  status,
  promptHandle,
}: UserStatusProps) {
  const updateStatus = useMutation({
    mutationFn: (data: Parameters<typeof api.modUpdateAccountStatus>) => {
      return api.modUpdateAccountStatus(...data);
    },
    onError(error) {
      toast.error(error.message);
    },
    onSuccess() {
      void queryClient.invalidateQueries({
        queryKey: ['profile', userId, 'account'],
      });
      void queryClient.invalidateQueries({
        queryKey: ['profile', userId, 'mod-moderations'],
      });
    },
  });

  if (status === undefined) return <div className="skeleton h-36 w-72"></div>;

  return (
    <div className="w-72 flex flex-col gap-1">
      <h2
        className={cn(
          'font-semibold text-lg',
          status ? 'text-success' : 'text-error'
        )}
      >
        {status ? 'Account active' : 'Account blocked'}
      </h2>
      <div className="text-xs">
        Blocked accounts cannot log in or perform any actions.
      </div>
      <div className="text-xs">
        Account notification cannot be sent for this action, but a message
        should still be provided for documentation.
      </div>
      <button
        className={cn(
          'btn btn-xs btn-primary w-full mt-2',
          updateStatus.isPending && 'btn-disabled',
          status ? 'btn-error' : 'btn-success'
        )}
        onClick={() =>
          modPrompt(promptHandle)
            .then(message => updateStatus.mutate([userId, !status, message]))
            .catch(() => {})
        }
      >
        {updateStatus.isPending
          ? 'Saving...'
          : status
            ? 'Block account'
            : 'Unblock account'}
      </button>
    </div>
  );
});
