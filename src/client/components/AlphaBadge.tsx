import { memo } from 'react';
import { cn } from '../uiHelper';

export interface AlphaBadgeProps {
  className?: string;
}

export default memo(function AlphaBadge({ className }: AlphaBadgeProps) {
  return (
    <div
      className={cn(
        `tooltip tooltip-bottom tooltip-info badge badge-lg badge-error font-mono`,
        className
      )}
      data-tip="Back up important data"
    >
      BETA
    </div>
  );
});
