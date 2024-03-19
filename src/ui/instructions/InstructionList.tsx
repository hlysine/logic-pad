import { InstructionProps } from './Instruction';
import { State } from '../../data/primitives';
import { memo, useMemo } from 'react';
import { useGrid } from '../GridContext';
import { HiOutlineLightBulb } from 'react-icons/hi';

export interface InstructionListProps {
  children: React.NamedExoticComponent<InstructionProps>;
}

function Title({ children }: { children: React.ReactNode }) {
  return (
    <div className="uppercase w-36 text-center bg-secondary bg-opacity-10 text-neutral-content mt-4">
      {children}
    </div>
  );
}

export default memo(function InstructionList({
  children: Instruction,
}: InstructionListProps) {
  const { grid, state, solution } = useGrid();
  const symbolMap = useMemo(() => {
    const map = new Map<string, State>();
    if (!state) return map;
    for (const [key, value] of state.symbols) {
      if (value.some(s => s === State.Error)) {
        map.set(key, State.Error);
      } else if (value.some(s => s === State.Incomplete)) {
        map.set(key, State.Incomplete);
      } else {
        map.set(key, State.Satisfied);
      }
    }
    return map;
  }, [state]);
  const statusText = useMemo(
    () =>
      grid.rules
        .map(rule => rule.statusText(grid, solution, state))
        .filter(Boolean)
        .join('\n'),
    [grid, solution, state]
  );
  return (
    <div className="flex flex-col items-end w-[320px] self-stretch">
      <div className="flex flex-col flex-1 items-end justify-center">
        {grid.rules.length > 0 && <Title>Rules</Title>}
        {grid.rules.map((rule, i) => (
          <Instruction
            key={rule.id + i}
            instruction={rule}
            state={state?.rules[i]?.state}
          />
        ))}
        {grid.symbols.size > 0 && <Title>Symbols</Title>}
        {[...grid.symbols.keys()].map(key => (
          <Instruction
            key={key}
            instruction={grid.symbols.get(key)![0]}
            state={symbolMap.get(key)}
          />
        ))}
      </div>
      {statusText.trim().length > 0 && (
        <div className="card grow-0 shrink-0 card-side bg-base-100 shadow-md m-4 ml-0 pl-4 self-stretch">
          <figure className="shrink-0">
            <HiOutlineLightBulb size={36} />
          </figure>
          <div className="card-body p-4">
            <p>{statusText}</p>
          </div>
        </div>
      )}
    </div>
  );
});
