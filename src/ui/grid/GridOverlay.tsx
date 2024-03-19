import { cn } from '../../utils';

export interface GridOverlayProps {
  className?: string;
  children?: React.ReactNode;
}

export default function GridOverlay({ children, className }: GridOverlayProps) {
  return (
    <div className={cn('absolute inset-0 pointer-events-none', className)}>
      {children}
    </div>
  );
}
