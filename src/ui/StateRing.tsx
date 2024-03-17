import { memo } from 'react';
import { ringBorder } from './helper';
import { cn } from '../utils';
import { useGrid } from './GridContext';

export interface GridRingProps {
  children?: React.ReactNode;
}

export default memo(function StateRing({ children }: GridRingProps) {
  const { state } = useGrid();
  return (
    <div
      className={cn(
        'w-fit h-fit border-4 p-4 rounded-xl',
        ringBorder(state.final)
      )}
    >
      {children}
    </div>
  );
});
