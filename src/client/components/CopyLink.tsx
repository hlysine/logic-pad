import { memo, useEffect, useState } from 'react';
import { useGrid } from '../contexts/GridContext.tsx';
import { cn } from '../uiHelper.ts';
import { Compressor } from '@logic-pad/core/data/serializer/compressor/allCompressors';
import { Serializer } from '@logic-pad/core/data/serializer/allSerializers';

const ShareButton = memo(function ShareButton({
  onClick,
  className,
  children,
}: {
  onClick: () => Promise<void>;
  className?: string;
  children: React.ReactNode;
}) {
  const [tooltip, setTooltip] = useState<string | null>(null);
  useEffect(() => {
    if (tooltip && tooltip.length > 0) {
      const timeout = window.setTimeout(() => setTooltip(null), 2000);
      return () => clearTimeout(timeout);
    }
  }, [tooltip]);
  return (
    <div
      className={cn(
        'tooltip tooltip-info tooltip-top flex-1',
        tooltip && 'tooltip-open'
      )}
      data-tip={tooltip}
    >
      <button
        type="button"
        className={cn('btn w-full', className)}
        onClick={async () => {
          await onClick();
          setTooltip('Copied!');
        }}
      >
        {children}
      </button>
    </div>
  );
});

export default memo(function CopyLink() {
  const { grid, solution, metadata } = useGrid();
  return (
    <div className="flex justify-stretch items-stretch gap-1">
      <ShareButton
        onClick={async () => {
          const data = await Compressor.compress(
            Serializer.stringifyPuzzle({ ...metadata, grid, solution })
          );
          const url = new URL(window.location.href);
          url.searchParams.set('loader', 'visible');
          url.searchParams.set('d', data);
          url.pathname = '/create';
          await navigator.clipboard.writeText(url.href);
        }}
      >
        Copy edit link
      </ShareButton>
      <ShareButton
        className="btn-primary"
        onClick={async () => {
          const data = await Compressor.compress(
            Serializer.stringifyPuzzle({ ...metadata, grid, solution })
          );
          const url = new URL(window.location.href);
          url.searchParams.set('d', data);
          url.pathname = '/solve';
          await navigator.clipboard.writeText(url.href);
        }}
      >
        Copy share link
      </ShareButton>
    </div>
  );
});
