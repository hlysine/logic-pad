import { State } from '../../data/primitives';
import { memo, useMemo } from 'react';
import { useGrid } from '../GridContext';
import MultiEntrySymbol from '../../data/symbols/multiEntrySymbol';
import { useGridState } from '../GridStateContext';
import Instruction from './Instruction';
import EditTarget from './EditTarget';
import { cn } from '../../utils';

function Title({ children }: { children: React.ReactNode }) {
  return (
    <div className="uppercase w-36 text-center bg-secondary bg-opacity-10 text-neutral-content mt-4">
      {children}
    </div>
  );
}

export interface InstructionListProps {
  editable?: boolean;
}

export default memo(function InstructionList({
  editable,
}: InstructionListProps) {
  editable = editable ?? false;
  const { grid } = useGrid();
  const { state } = useGridState();
  const filteredRules = useMemo(() => {
    if (editable) return grid.rules;
    return grid.rules.filter(rule => rule.visibleWhenSolving);
  }, [grid.rules, editable]);
  const hasSymbols = useMemo(() => {
    if (grid.symbols.size === 0) return false;
    for (const [_, value] of grid.symbols) {
      for (const symbol of value) {
        if (symbol.explanation.length > 0) return true;
      }
    }
    return false;
  }, [grid]);
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
      const stateSymbols = state.symbols.get(key);
      if (!stateSymbols) continue;
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
  return (
    <div className="flex flex-col items-end w-[320px] justify-start self-stretch overflow-y-auto">
      <div className="flex flex-col shrink-0 items-end justify-start">
        {filteredRules.length > 0 && <Title>Rules</Title>}
        {filteredRules.map((rule, i) => (
          <Instruction
            key={rule.id + i.toString()}
            instruction={rule}
            state={state?.rules[i]?.state}
            className={cn(rule.visibleWhenSolving || 'opacity-60')}
          >
            {editable && <EditTarget instruction={rule} />}
          </Instruction>
        ))}
        {hasSymbols && <Title>Symbols</Title>}
        {[...symbolMergeMap.entries()].flatMap(([key, value]) =>
          value.map(
            (group, i) =>
              grid.symbols.get(key)![group[0]].explanation.length > 0 && (
                <Instruction
                  key={key + group[0].toString()}
                  instruction={grid.symbols.get(key)![group[0]]}
                  state={symbolStateMap.get(key)?.[i]}
                />
              )
          )
        )}
      </div>
    </div>
  );
});
