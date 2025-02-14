import { State } from '@logic-pad/core/data/primitives';
import { memo, useMemo } from 'react';
import { useGrid } from '../contexts/GridContext.tsx';
import MultiEntrySymbol from '@logic-pad/core/data/symbols/multiEntrySymbol';
import { useGridState } from '../contexts/GridStateContext.tsx';
import Instruction from './Instruction';
import EditTarget from './EditTarget';
import { cn } from '../../client/uiHelper.ts';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import RuleData from '@logic-pad/core/data/rules/rule';

function Title({ children }: { children: React.ReactNode }) {
  return (
    <div className="uppercase w-36 text-center bg-secondary bg-opacity-10 text-neutral-content mt-4 shrink-0">
      {children}
    </div>
  );
}

export interface InstructionListProps {
  editable?: boolean;
}

interface SortableItem {
  id: string | number;
  rule: RuleData;
}

export default memo(function InstructionList({
  editable,
}: InstructionListProps) {
  editable = editable ?? false;
  const { grid, setGrid } = useGrid();
  const { state } = useGridState();
  const filteredRules = useMemo<SortableItem[]>(() => {
    if (editable)
      return grid.rules.map((rule, i) => ({
        id: i,
        rule,
      }));
    return grid.rules
      .filter(rule => rule.visibleWhenSolving)
      .map((rule, i) => ({
        id: i,
        rule,
      }));
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
  const symbolSortOrder = useMemo(() => {
    return [...grid.symbols.keys()].sort((a, b) => {
      const aOrder = grid.symbols.get(a)![0].sortOrder;
      const bOrder = grid.symbols.get(b)![0].sortOrder;
      return aOrder - bOrder;
    });
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

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const wrapWithDraggable = (children: React.ReactNode) => (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={e => {
        const { active, over } = e;

        if (over && active.id !== over.id) {
          setGrid(
            grid.withRules(
              arrayMove(
                grid.rules.slice(),
                filteredRules.map(r => r.id).indexOf(active.id),
                filteredRules.map(r => r.id).indexOf(over.id)
              )
            )
          );
        }
      }}
    >
      <SortableContext
        items={filteredRules}
        strategy={verticalListSortingStrategy}
      >
        {children}
      </SortableContext>
    </DndContext>
  );

  return (
    <div className="flex flex-col items-end w-[320px] sm:w-[640px] lg:w-[320px] justify-start self-stretch overflow-y-auto py-[1px] relative lg:left-2">
      {/* Dirty 1px vertical padding to hide the 1px overflow that comes from nowhere */}
      {filteredRules.length > 0 && <Title>Rules</Title>}
      <div className="flex flex-row lg:flex-col flex-wrap lg:flex-nowrap shrink-0 justify-end items-center">
        {(editable ? wrapWithDraggable : (t: React.ReactNode) => t)(
          filteredRules.map(({ rule, id }, i) => (
            <Instruction
              key={rule.id + i.toString()}
              editable={editable}
              id={id}
              instruction={rule}
              state={state?.rules[i]?.state}
              className={cn(rule.visibleWhenSolving || 'opacity-60')}
            >
              {editable && <EditTarget configurable={rule} />}
            </Instruction>
          ))
        )}
      </div>
      {hasSymbols && <Title>Symbols</Title>}
      <div className="flex flex-row lg:flex-col flex-wrap lg:flex-nowrap shrink-0 justify-end items-center">
        {symbolSortOrder.flatMap(key => {
          const value = symbolMergeMap.get(key)!;
          return value.map(
            (group, i) =>
              grid.symbols.get(key)![group[0]].explanation.length > 0 && (
                <Instruction
                  id={i}
                  editable={false}
                  key={key + group[0].toString()}
                  instruction={grid.symbols.get(key)![group[0]]}
                  state={symbolStateMap.get(key)?.[i]}
                />
              )
          );
        })}
      </div>
    </div>
  );
});
