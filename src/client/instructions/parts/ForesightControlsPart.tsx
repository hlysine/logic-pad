import { memo, useEffect, useState } from 'react';
import { useGrid } from '../../contexts/GridContext.tsx';
import { PartPlacement, PartSpec } from './types';
import ForesightRule, {
  instance as foresightInstance,
} from '@logic-pad/core/data/rules/foresightRule';
import { useForesight } from '../../contexts/ForesightContext.tsx';
import { IoIosEye } from 'react-icons/io';
import { Color, Position } from '@logic-pad/core/data/primitives';

export interface ForesightControlsPartProps {
  instruction: ForesightRule;
}

const animationInterval = 0.1;

export default memo(function ForesightControlsPart({
  instruction,
}: ForesightControlsPartProps) {
  const { grid, solution } = useGrid();
  const {
    setForesight,
    message,
    position,
    grid: foresightGrid,
  } = useForesight();
  const [charges, setCharges] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (instruction.startFull) {
      setCharges(instruction.count);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handle = setInterval(() => {
      setProgress(p =>
        Math.min(100, p + (100 / instruction.regenInterval) * animationInterval)
      );
    }, animationInterval * 1000);
    return () => clearInterval(handle);
  }, [instruction.regenInterval]);

  useEffect(() => {
    if (progress >= 100) {
      setCharges(c => Math.min(instruction.count, c + 1));
      setProgress(0);
    }
  }, [progress, instruction.count]);

  useEffect(() => {
    if (foresightGrid === null && (message != null || position != null)) {
      setForesight(foresightGrid, null, null);
    } else if (foresightGrid !== grid) {
      setForesight(null, null, null);
    }
  }, [foresightGrid, grid, message, position, setForesight]);

  if (!solution) return null;

  return (
    <>
      {message && (
        <div className="card grow-0 shrink-0 card-side rounded-none bg-primary/10">
          <figure className="shrink-0 p-2">
            <IoIosEye size={16} />
          </figure>
          <div className="card-body p-4">
            <p>{message}</p>
          </div>
        </div>
      )}
      <div className="grow-0 shrink-0 bg-primary/10 flex flex-col items-stretch">
        <div className="flex gap-2 justify-around items-center">
          <button
            type="button"
            className="btn btn-ghost text-lg"
            disabled={charges <= 0 || !solution}
            onClick={() => {
              setCharges(c => c - 1);
              const errors: Position[] = [];
              const noGray = !!grid.musicGrid.value;
              grid.forEach((tile, x, y) => {
                const solutionTile = solution.getTile(x, y);
                if (
                  !solutionTile.exists ||
                  !tile.exists ||
                  tile.color === Color.Gray ||
                  (noGray && tile.color === Color.Light)
                )
                  return;
                if (solutionTile.color !== tile.color) {
                  errors.push({ x, y });
                }
              });
              if (errors.length === 0) {
                setForesight(grid, null, 'Your progress is correct');
              } else if (errors.length === 1) {
                setForesight(
                  grid,
                  errors[0],
                  'This tile is wrong, but all others are correct'
                );
              } else {
                setForesight(
                  grid,
                  errors[0],
                  "Multiple tiles are wrong. Here's one of them"
                );
              }
            }}
          >
            <IoIosEye />
            Foresight
          </button>
          <span>
            <span className="text-2xl text-primary inline-block mr-2 font-bold">
              {charges}
            </span>
            remaining
          </span>
        </div>
        <progress
          className="progress progress-primary"
          value={charges >= instruction.count ? 100 : progress}
          max="100"
        ></progress>
      </div>
    </>
  );
});

export const spec: PartSpec = {
  placement: PartPlacement.LeftBottom,
  instructionId: foresightInstance.id,
};
