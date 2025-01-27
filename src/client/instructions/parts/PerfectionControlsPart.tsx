import { memo, useEffect, useMemo, useState } from 'react';
import { PartPlacement, PartSpec } from './types';
import PerfectionRule, {
  instance as perfectionInstance,
} from '@logic-pad/core/data/rules/perfectionRule';
import { MdError } from 'react-icons/md';
import { useGridState } from '../../contexts/GridStateContext';
import { Color, State, Position } from '@logic-pad/core/data/primitives';
import { useEdit } from '../../contexts/EditContext';
import { useGrid } from '../../contexts/GridContext';
import { useHotkeys } from 'react-hotkeys-hook';
import { useSolvePath } from '../../contexts/SolvePathContext';
import { useDelta } from 'react-delta-hooks';

export interface PerfectionControlsPartProps {
  instruction: PerfectionRule;
}

export default memo(function PerfectionControlsPart() {
  const { grid, setGridRaw } = useGrid();
  const { state } = useGridState();
  const { undo } = useEdit();
  const {
    solvePath,
    setSolvePath,
    visualizeSolvePath,
    setVisualizeSolvePath,
    alwaysAllowUndo,
  } = useSolvePath();
  const [tooltip, setTooltip] = useState<string | null>(null);

  useEffect(() => {
    if (tooltip) {
      const timeout = window.setTimeout(() => setTooltip(null), 2000);
      return () => clearTimeout(timeout);
    }
  }, [tooltip]);

  const handleUndo = () => {
    if (state.final !== State.Error && !alwaysAllowUndo) return;
    const result = undo(grid);
    if (result) setGridRaw(result);
  };

  useHotkeys('z', handleUndo, { preventDefault: true });

  const gridDelta = useDelta(grid);
  useEffect(() => {
    if (!gridDelta) return;
    if (!gridDelta.prev) return;
    if (gridDelta.prev === gridDelta.curr) return;
    console.log(
      'Comparing grid delta',
      { width: gridDelta.prev.width, height: gridDelta.prev.height },
      { width: gridDelta.curr.width, height: gridDelta.curr.height }
    );
    const positionsRemoved: Position[] = [];
    const positionsAdded: Position[] = [];
    let newSolvePath = solvePath.slice();
    grid.tiles.forEach((row, y) => {
      row.forEach((tile, x) => {
        const oldTile = gridDelta.prev!.tiles[y][x];
        if (tile === oldTile || tile.exists !== oldTile.exists) return;
        if (tile.color === Color.Gray && oldTile.color !== Color.Gray)
          positionsRemoved.push({ x, y });
        if (tile.color !== Color.Gray && oldTile.color === Color.Gray)
          positionsAdded.push({ x, y });
      });
    });
    if (positionsRemoved.length > 0) {
      const endOfPath = solvePath.slice(-positionsRemoved.length);
      if (
        endOfPath.every(pos =>
          positionsRemoved.some(p => p.x === pos.x && p.y === pos.y)
        )
      ) {
        newSolvePath.splice(-positionsRemoved.length);
      } else {
        newSolvePath = [];
      }
    }
    if (positionsAdded.length > 0) {
      if (
        solvePath.some(pos =>
          positionsAdded.some(p => p.x === pos.x && p.y === pos.y)
        )
      ) {
        newSolvePath = [];
      }
      newSolvePath.push(...positionsAdded);
    }
    setSolvePath(newSolvePath);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gridDelta, solvePath, setSolvePath]);

  const progress = useMemo(() => {
    const empty = grid.getTileCount(true, false, Color.Gray);
    const filled = solvePath.length;
    return (filled / (empty + filled)) * 100;
  }, [grid, solvePath]);

  return (
    <>
      {state.final === State.Error && (
        <div className="card grow-0 shrink-0 card-side rounded-none bg-primary/10">
          <figure className="shrink-0 pl-2 self-center">
            <MdError size={48} />
          </figure>
          <div className="card-body p-4">
            <p>Your progress is incorrect</p>
            <button className="btn btn-primary" onClick={handleUndo}>
              Undo
            </button>
          </div>
        </div>
      )}
      <div className="grow-0 shrink-0 bg-primary/10 flex flex-col items-stretch gap-1">
        <div className="flex flex-col gap-4 justify-around mx-4 my-2 items-stretch">
          <div className="form-control">
            <label className="label cursor-pointer">
              <span className="label-text">Visualize solve path</span>
              <input
                type="checkbox"
                className="toggle"
                checked={visualizeSolvePath}
                onChange={e => setVisualizeSolvePath(e.currentTarget.checked)}
              />
            </label>
            <div
              className="tooltip"
              data-tip={
                tooltip ??
                (progress < 100
                  ? 'Finish the puzzle first'
                  : 'Copy solve path as text')
              }
            >
              <button
                className="btn btn-sm btn-neutral"
                disabled={progress < 100}
                onClick={async () => {
                  const output = solvePath
                    .map(({ x, y }) => `${x},${y}`)
                    .join('/');
                  await navigator.clipboard.writeText(output);
                  setTooltip('Copied!');
                }}
              >
                Copy solve path
              </button>
            </div>
          </div>
        </div>
        <progress
          className="progress progress-primary"
          value={progress}
          max="100"
        ></progress>
      </div>
    </>
  );
});

export const spec: PartSpec = {
  placement: PartPlacement.LeftBottom,
  instructionId: perfectionInstance.id,
};
