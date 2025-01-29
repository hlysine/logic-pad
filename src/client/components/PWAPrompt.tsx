import { memo } from 'react';
import { FiAlertCircle } from 'react-icons/fi';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { Compressor } from '@logic-pad/core/data/serializer/compressor/allCompressors';
import { Serializer } from '@logic-pad/core/data/serializer/allSerializers';
import { useGrid } from '../contexts/GridContext.tsx';

export default memo(function PWAPrompt() {
  const { needRefresh, updateServiceWorker } = useRegisterSW();
  const { metadata, grid, solution } = useGrid();
  const [refresh, setRefresh] = needRefresh;
  if (!refresh) return null;
  return (
    <div
      role="alert"
      className="alert min-w-[min(100%-1rem,512px)] w-fit fixed top-2 right-2 max-w-[calc(100%-1rem)] shadow-xl z-50"
    >
      <FiAlertCircle />
      <span>Update available. Reload site now? 3</span>
      <div>
        <button
          type="button"
          className="btn btn-sm"
          onClick={() => setRefresh(false)}
        >
          Cancel
        </button>
        <button
          type="button"
          className="btn btn-sm btn-primary"
          onClick={async () => {
            const newLocation = `${window.location.origin}${window.location.pathname}?d=${await Compressor.compress(
              Serializer.stringifyPuzzle({ ...metadata, grid, solution })
            )}`;
            try {
              window.history.pushState({}, '', newLocation);
              await updateServiceWorker(true);
            } finally {
              window.location.href = newLocation;
            }
          }}
        >
          Reload
        </button>
      </div>
    </div>
  );
});
