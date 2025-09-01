import { memo } from 'react';
import { FiAlertCircle } from 'react-icons/fi';
import { useRegisterSW } from 'virtual:pwa-register/react';

export default memo(function PWAPrompt() {
  const { needRefresh, updateServiceWorker } = useRegisterSW();
  const [refresh, setRefresh] = needRefresh;
  if (!refresh) return null;
  return (
    <div
      role="alert"
      className="alert min-w-[min(100%-1rem,512px)] w-fit fixed top-2 right-2 max-w-[calc(100%-1rem)] shadow-xl z-50"
    >
      <FiAlertCircle />
      <span>Update available. Apply update now?</span>
      <div>
        <button
          type="button"
          className="btn btn-sm"
          onClick={() => setRefresh(false)}
        >
          Later
        </button>
        <button
          type="button"
          className="btn btn-sm btn-primary"
          onClick={async () => {
            // notify all tabs to disable navigation blockers and encode current state
            const broadcast = new BroadcastChannel('prepareForUpdate');
            broadcast.postMessage(true);
            broadcast.close();
            // wait for tabs to respond
            await new Promise(resolve => setTimeout(resolve, 1000));

            await updateServiceWorker(true);
            setRefresh(false);
          }}
        >
          Reload
        </button>
      </div>
    </div>
  );
});
