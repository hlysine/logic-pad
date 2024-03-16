import { memo, useMemo } from 'react';
import { State } from '../data/primitives';
import { ringBorder } from './helper';
import { cn } from '../utils';
import { useGrid } from './GridContext';

export interface GridRingProps {
  children?: React.ReactNode;
}

export default memo(function StateRing({ children }: GridRingProps) {
  const { state } = useGrid();
  const combinedState = useMemo(() => {
    if (state.rules.some(s => s.state === State.Error)) return State.Error;
    for (const [_, symbolList] of state.symbols) {
      if (symbolList.some(s => s === State.Error)) return State.Error;
    }

    if (state.rules.some(s => s.state === State.Incomplete))
      return State.Incomplete;
    for (const [_, symbolList] of state.symbols) {
      if (symbolList.some(s => s === State.Incomplete)) return State.Incomplete;
    }

    if (state.rules.length === 0 && state.symbols.size === 0)
      return State.Incomplete;

    return State.Satisfied;
  }, [state]);
  return (
    <div
      className={cn(
        'w-fit h-fit border-4 p-4 rounded-xl',
        ringBorder(combinedState)
      )}
    >
      {children}
    </div>
  );
});
