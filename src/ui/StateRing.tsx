import { memo } from 'react';
import { ringBorder } from './helper';
import { cn } from '../utils';
import { useGrid } from './GridContext';
import { State } from '../data/primitives';

export interface GridRingProps {
  children?: React.ReactNode;
}

export default memo(function StateRing({ children }: GridRingProps) {
  const { state } = useGrid();
  return (
    <div
      className={cn(
        'w-fit h-fit border-4 p-4 rounded-xl transition-shadow',
        ringBorder(state.final),
        state.final === State.Satisfied
          ? 'first:*:opacity-100'
          : 'first:*:opacity-0'
      )}
    >
      <div className="block fixed inset-0 transition-all duration-[3s] ease-in bg-radient-circle-c from-transparent to-success/15 z-[1000] pointer-events-none"></div>
      {children}
    </div>
  );
});
