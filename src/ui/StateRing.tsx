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
          ? 'first:*:opacity-100 first:*:duration-[1.5s]'
          : 'first:*:opacity-0 first:*:duration-[0.5s]'
      )}
    >
      <div className="block fixed inset-0 transition-all ease-in-out bg-radient-circle-c from-transparent to-success/10 z-[1000] pointer-events-none"></div>
      {children}
    </div>
  );
});
