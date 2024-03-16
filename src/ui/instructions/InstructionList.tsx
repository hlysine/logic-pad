import { InstructionProps } from './Instruction';
import { State } from '../../data/primitives';
import { memo, useMemo } from 'react';
import { useGrid } from '../GridContext';

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
  const { grid: data, state } = useGrid();
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
  return (
    <div className="flex flex-col items-end justify-center">
      {data.rules.length > 0 && <Title>Rules</Title>}
      {data.rules.map((rule, i) => (
        <Instruction
          key={rule.id + i}
          instruction={rule}
          index={i}
          state={state?.rules[i]?.state}
        />
      ))}
      {data.symbols.size > 0 && <Title>Symbols</Title>}
      {[...data.symbols.keys()].map(key => (
        <Instruction
          key={key}
          instruction={data.symbols.get(key)![0]}
          index={null}
          state={symbolMap.get(key)}
        />
      ))}
    </div>
  );
});
