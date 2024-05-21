import { memo } from 'react';
import { cn } from '../../client/uiHelper.ts';

export interface LoadingProps {
  className?: string;
}

export default memo(function Loading({ className }: LoadingProps) {
  return (
    <div
      className={cn(
        'h-full w-full flex items-center justify-center',
        className
      )}
    >
      <span className="loading loading-bars loading-lg"></span>
    </div>
  );
});
