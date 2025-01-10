import { memo, useMemo } from 'react';
import { HiOutlineLightBulb } from 'react-icons/hi';
import { useGrid } from '../../contexts/GridContext.tsx';
import { Color } from '@logic-pad/core/data/primitives';
import { PartPlacement, PartSpec } from './types';
import { instance as undercluedInstance } from '@logic-pad/core/data/rules/undercluedRule';

export default memo(function UndercluedPart() {
  const { grid, solution } = useGrid();
  const statusText = useMemo(() => {
    if (solution === null) return null;
    let solutionCount = 0;
    let gridCount = 0;
    grid.forEach(tile => {
      if (!tile.fixed && tile.color !== Color.Gray) gridCount++;
    });
    solution.forEach(tile => {
      if (!tile.fixed && tile.color !== Color.Gray) solutionCount++;
    });
    return `Tiles Remaining: ${solutionCount - gridCount}`;
  }, [grid, solution]);
  if (statusText === null) return null;
  return (
    <div className="card grow-0 shrink-0 card-side rounded-none bg-primary/10">
      <figure className="shrink-0 p-2">
        <HiOutlineLightBulb size={24} />
      </figure>
      <div className="card-body p-4">
        <p>{statusText}</p>
      </div>
    </div>
  );
});

export const spec: PartSpec = {
  placement: PartPlacement.LeftPanel,
  instructionId: undercluedInstance.id,
};
