import { memo } from 'react';
import { cn } from '../uiHelper';

export interface AlphaBadgeProps {
  className?: string;
}

export default memo(function AlphaBadge({ className }: AlphaBadgeProps) {
  return (
    <div
      className={cn(
        `tooltip tooltip-bottom tooltip-error badge badge-lg badge-error font-mono`,
        className
      )}
      data-tip="This version is unstable and databases may be wiped!"
    >
      ALPHA
    </div>
  );
});
