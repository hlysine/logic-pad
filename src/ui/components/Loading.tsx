import { cn } from '../../utils';

export interface LoadingProps {
  className?: string;
}

export default function Loading({ className }: LoadingProps) {
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
}
