import { useMemo } from 'react';
import { GridState, State } from '../data/primitives';
import { ringBorder } from './helper';
import { cn } from '../utils';

export interface GridRingProps {
  children?: React.ReactNode;
  state: GridState;
}

export default function GridRing({ state, children }: GridRingProps) {
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
}
