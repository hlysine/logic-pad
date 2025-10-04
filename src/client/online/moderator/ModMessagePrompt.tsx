import { memo, RefObject, useImperativeHandle, useState } from 'react';
import { cn } from '../../uiHelper';

export type PromptHandle = {
  prompt: () => Promise<string>;
};

export async function modPrompt(handle: RefObject<PromptHandle | null>) {
  if (!handle.current) {
    const result = window.prompt('Message to user:');
    if (!result) throw new Error('Prompt cancelled');
    return result;
  }
  return await handle.current.prompt();
}

export interface ModMessagePromptProps {
  ref?: React.Ref<PromptHandle>;
}

export default memo(function ModMessagePrompt({ ref }: ModMessagePromptProps) {
  const [handle, setHandle] = useState<{
    resolve: (message: string) => void;
    reject: () => void;
  } | null>(null);
  const [message, setMessage] = useState('');

  useImperativeHandle(ref, () => ({
    prompt: () => {
      return new Promise((resolve, reject) => setHandle({ resolve, reject }));
    },
  }));

  return (
    <dialog
      id="modMessageModal"
      className={cn('modal', handle && 'modal-open')}
    >
      {handle && (
        <>
          <div className="modal-box">
            <h3 className="font-bold text-lg">Message to user</h3>
            <p className="py-4">
              The user will receive an account notification with this message.
            </p>
            <textarea
              className="textarea textarea-bordered w-full"
              autoFocus
              value={message}
              onChange={e => setMessage(e.target.value)}
            />
            <div className="alert my-4">
              Please describe your action and the reason for doing so. This
              message will be logged along with your moderation action.
            </div>
            <div className="modal-action">
              <button
                className="btn"
                onClick={() => {
                  handle.reject();
                  setMessage('');
                  setHandle(null);
                }}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={() => {
                  handle.resolve(message);
                  setMessage('');
                  setHandle(null);
                }}
              >
                Send
              </button>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button
              type="button"
              onClick={() => {
                handle.reject();
                setMessage('');
                setHandle(null);
              }}
            >
              close
            </button>
          </form>
        </>
      )}
    </dialog>
  );
});
