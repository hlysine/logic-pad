import { FiAlertCircle } from 'react-icons/fi';
import { useRegisterSW } from 'virtual:pwa-register/react';

export default function PWAPrompt() {
  const { needRefresh, updateServiceWorker } = useRegisterSW();
  const [refresh, setRefresh] = needRefresh;
  if (!refresh) return null;
  return (
    <div
      role="alert"
      className="alert fixed top-2 right-2 max-w-[calc(100%-1rem)] shadow-xl z-50"
    >
      <FiAlertCircle />
      <span>Update available. Reload site now?</span>
      <div>
        <button className="btn btn-sm" onClick={() => setRefresh(false)}>
          Cancel
        </button>
        <button
          className="btn btn-sm btn-primary"
          onClick={() => updateServiceWorker(true)}
        >
          Reload
        </button>
      </div>
    </div>
  );
}
