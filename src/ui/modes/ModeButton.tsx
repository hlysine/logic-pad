import { memo, useTransition } from 'react';
import { cn } from '../../utils';
import { Mode } from '../../data/primitives';

export interface ModeButtonProps {
  active: boolean;
  mode: Mode;
  onModeChange: (newMode: Mode) => void;
  children?: React.ReactNode;
}

export default memo(function ModeButton({
  active,
  mode,
  onModeChange,
  children,
}: ModeButtonProps) {
  const [isPending, startTransition] = useTransition();
  return (
    <a
      role="tab"
      className={cn('tab w-36', active && 'tab-active')}
      onClick={() => startTransition(() => onModeChange(mode))}
    >
      {isPending ? (
        <span className="loading loading-bars loading-md"></span>
      ) : (
        children
      )}
    </a>
  );
});
