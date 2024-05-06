import { memo, useEffect, useState } from 'react';
import { useGrid } from '../GridContext';
import { cn } from '../../utils';
import { Compressor } from '../../data/serializer/compressor/allCompressors';
import { Serializer } from '../../data/serializer/allSerializers';

export default memo(function ShareButton() {
  const [tooltip, setTooltip] = useState<string | null>(null);
  const { grid, solution, metadata } = useGrid();
  useEffect(() => {
    if (tooltip) {
      const timeout = window.setTimeout(() => setTooltip(null), 2000);
      return () => clearTimeout(timeout);
    }
  }, [tooltip]);
  return (
    <div
      className={cn(
        'tooltip tooltip-primary tooltip-top',
        tooltip && 'tooltip-open'
      )}
      data-tip={tooltip}
    >
      <button
        type="button"
        className="btn btn-primary w-full"
        onClick={async () => {
          const data = await Compressor.compress(
            Serializer.stringifyPuzzle({ ...metadata, grid, solution })
          );
          const url = new URL(window.location.href);
          url.searchParams.set('d', data);
          url.pathname = '/solve';
          await navigator.clipboard.writeText(url.href);
          setTooltip('Copied!');
        }}
      >
        Copy puzzle link
      </button>
    </div>
  );
});
