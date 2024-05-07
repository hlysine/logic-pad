import { ForwardedRef, forwardRef, memo } from 'react';
import { cn } from '../../utils';

export interface GridOverlayProps {
  className?: string;
  children?: React.ReactNode;
}

export default memo(
  forwardRef(function GridOverlay(
    { children, className }: GridOverlayProps,
    ref: ForwardedRef<HTMLDivElement>
  ) {
    return (
      <div
        ref={ref}
        className={cn('absolute inset-0 pointer-events-none', className)}
      >
        {children}
      </div>
    );
  })
);
