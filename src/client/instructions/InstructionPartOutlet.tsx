import { memo, useMemo } from 'react';
import { PartPlacement } from './parts/types';
import { PartComponent, allParts } from './parts';
import Instruction from '@logic-pad/core/data/instruction';
import GridData from '@logic-pad/core/data/grid';
import { useInstructionParts } from '../contexts/InstructionPartsContext';

interface InstructionPartsContextOutlet {
  placement: PartPlacement;
}

const InstructionPartsContextOutlet = memo(
  function InstructionPartsContextOutlet({
    placement,
  }: InstructionPartsContextOutlet) {
    const { parts } = useInstructionParts();
    return parts.get(placement) ?? null;
  }
);

export interface InstructionPartOutletProps {
  placement: PartPlacement;
  grid: GridData;
}

export default memo(function InstructionPartOutlet({
  placement,
  grid,
}: InstructionPartOutletProps) {
  const components = useMemo(() => {
    const result: [PartComponent, Instruction][] = [];
    grid.symbols.forEach((value, key) => {
      const parts = allParts
        .get(key)
        ?.filter(part => part.placement === placement);
      if (parts && parts.length > 0) {
        value.forEach(symbol => {
          parts.forEach(part => {
            result.push([part.component, symbol]);
          });
        });
      }
    });
    grid.rules.forEach(rule => {
      const parts = allParts
        .get(rule.id)
        ?.filter(part => part.placement === placement);
      if (parts && parts.length > 0) {
        parts.forEach(part => {
          result.push([part.component, rule]);
        });
      }
    });
    return result;
  }, [grid.symbols, grid.rules, placement]);
  return (
    <>
      {components.map(([Component, data], i) => (
        <Component key={i} instruction={data} />
      ))}
      <InstructionPartsContextOutlet placement={placement} />
    </>
  );
});
