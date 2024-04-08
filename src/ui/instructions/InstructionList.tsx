import { InstructionProps } from './Instruction';
import { State } from '../../data/primitives';
import { memo, useMemo } from 'react';
import { useGrid } from '../GridContext';
import { HiOutlineLightBulb } from 'react-icons/hi';
import MultiEntrySymbol from '../../data/symbols/multiEntrySymbol';

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
  const symbolMergeMap = useMemo(() => {
    const map = new Map<string, number[][]>();
    for (const [key, value] of grid.symbols ?? []) {
      if (value.length === 0) continue;
      if (!(value[0] instanceof MultiEntrySymbol)) {
        map.set(key, [value.map((_, i) => i)]);
        continue;
      }
      value.forEach((s, i) => {
        if (!map.has(key)) {
          map.set(key, [[i]]);
          return;
        }

        const index = map
          .get(key)!
          .findIndex(x =>
            (value[x[0]] as MultiEntrySymbol).descriptionEquals(s)
          );
        if (index === -1) {
          map.get(key)!.push([i]);
        } else {
          map.get(key)![index].push(i);
        }
      });
    }
    return map;
  }, [grid]);
  const symbolStateMap = useMemo(() => {
    const map = new Map<string, State[]>();
    if (!state) return map;
    for (const [key, value] of symbolMergeMap) {
      const stateSymbols = state.symbols.get(key)!;
      map.set(
        key,
        value.map(group => {
          if (group.some(s => stateSymbols[s] === State.Error)) {
            return State.Error;
          } else if (group.some(s => stateSymbols[s] === State.Incomplete)) {
            return State.Incomplete;
          } else {
            return State.Satisfied;
          }
        })
      );
    }
    return map;
  }, [symbolMergeMap, state]);
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
        {[...symbolMergeMap.entries()].flatMap(([key, value]) =>
          value.map((group, i) => (
            <Instruction
              key={key + group[0]}
              instruction={grid.symbols.get(key)![group[0]]}
              state={symbolStateMap.get(key)?.[i]}
            />
          ))
        )}
      </div>
      {statusText.trim().length > 0 && (
        <div className="card grow-0 shrink-0 card-side bg-base-100 shadow-md m-4 ml-0 pl-4 self-stretch">
          <figure className="shrink-0 p-2">
            <HiOutlineLightBulb size={24} />
          </figure>
          <div className="card-body p-4">
            <p>{statusText}</p>
          </div>
        </div>
      )}
    </div>
  );
});
