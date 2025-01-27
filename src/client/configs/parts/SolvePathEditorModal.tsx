import { memo, useEffect, useState } from 'react';
import { cn } from '../../uiHelper';
import EmbedContext from '../../contexts/EmbedContext';
import GridContext, { GridConsumer } from '../../contexts/GridContext';
import DisplayContext from '../../contexts/DisplayContext';
import GridStateContext from '../../contexts/GridStateContext';
import { Color, Position } from '@logic-pad/core/data/primitives';
import PerfectionRule from '@logic-pad/core/data/rules/perfectionRule';
import PerfectionScreen from '../../screens/PerfectionScreen';
import ForesightRule, {
  instance as foresightInstance,
} from '@logic-pad/core/data/rules/foresightRule';
import {
  SolvePathConsumer,
  useSolvePath,
} from '../../contexts/SolvePathContext';
import EditContext from '../../contexts/EditContext';
import { useDelta } from 'react-delta-hooks';
import { GridData } from '@logic-pad/core/index';

export interface SolvePathEditorModalProps {
  solvePath: Position[];
  setSolvePath: (solvePath: Position[]) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}

function EmbedLoader({ solvePath }: { solvePath: Position[] }) {
  const { setSolvePath } = useSolvePath();
  useEffect(() => {
    setSolvePath(solvePath);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}

function SolvePathUpdater({
  oldSolvePath,
  setSolvePath,
}: {
  oldSolvePath: Position[];
  setSolvePath: (solvePath: Position[]) => void;
}) {
  const { solvePath: newSolvePath } = useSolvePath();
  useEffect(() => {
    if (newSolvePath !== oldSolvePath) setSolvePath(newSolvePath);
  }, [newSolvePath, oldSolvePath, setSolvePath]);
  return null;
}

function prepareGrid(
  grid: GridData,
  respectSolvePath: boolean
): { grid: GridData; solution: GridData | null } {
  const newGrid = grid.withRules(rules => [
    new PerfectionRule(),
    ...rules.filter(r => r.id !== foresightInstance.id),
  ]);
  if (respectSolvePath) {
    const foresight = grid.findRule(r => r.id === foresightInstance.id) as
      | ForesightRule
      | undefined;
    if (!foresight) {
      return prepareGrid(newGrid, false);
    }
    const resetGrid = newGrid.withTiles(tiles =>
      tiles.map((row, y) =>
        row.map((tile, x) => {
          if (
            !tile.exists ||
            tile.fixed ||
            foresight.solvePath.some(p => p.x === x && p.y === y)
          ) {
            return tile;
          } else {
            return tile.withColor(Color.Gray);
          }
        })
      )
    );
    if (resetGrid.colorEquals(newGrid)) {
      return { grid: newGrid, solution: null };
    } else {
      return { grid: resetGrid, solution: newGrid };
    }
  } else {
    const resetGrid = newGrid.resetTiles();
    if (resetGrid.colorEquals(newGrid)) {
      return { grid: newGrid, solution: null };
    } else {
      return { grid: resetGrid, solution: newGrid };
    }
  }
}

function lockGrid(grid: GridData): GridData {
  return grid.withTiles(tiles =>
    tiles.map(row =>
      row.map(tile =>
        tile.exists && tile.color !== Color.Gray ? tile.withFixed(true) : tile
      )
    )
  );
}

export default memo(function SolvePathEditorModal({
  solvePath,
  setSolvePath,
  open,
  setOpen,
}: SolvePathEditorModalProps) {
  const [tempSolvePath, setTempSolvePath] = useState(solvePath);

  const openDelta = useDelta(open);
  useEffect(() => {
    if (!openDelta) return;
    if (!openDelta.curr && openDelta.prev) {
      setSolvePath(tempSolvePath);
    }
  }, [openDelta, setSolvePath, tempSolvePath]);

  return (
    <dialog id="gridModal" className={cn('modal', open && 'modal-open')}>
      <div className="modal-box w-[calc(100%-4rem)] h-full max-w-none bg-neutral text-neutral-content">
        <form method="dialog">
          <button
            aria-label="Close dialog"
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={() => setOpen(false)}
          >
            ✕
          </button>
        </form>
        {open && (
          <GridConsumer>
            {({ grid: outerGrid, metadata }) => {
              return (
                <EmbedContext>
                  <DisplayContext>
                    <EditContext>
                      <GridStateContext>
                        <GridContext
                          grid={() =>
                            lockGrid(prepareGrid(outerGrid, true).grid)
                          }
                          solution={() => prepareGrid(outerGrid, true).solution}
                          metadata={metadata}
                        >
                          <PerfectionScreen>
                            <EmbedLoader solvePath={solvePath} />
                            <SolvePathUpdater
                              oldSolvePath={tempSolvePath}
                              setSolvePath={setTempSolvePath}
                            />
                            <SolvePathConsumer>
                              {({ setSolvePath }) => (
                                <GridConsumer>
                                  {({ setGrid: setInnerGrid }) => {
                                    return (
                                      <>
                                        <button
                                          type="button"
                                          className="btn"
                                          onClick={() => {
                                            setInnerGrid(
                                              prepareGrid(outerGrid, false).grid
                                            );
                                            setTempSolvePath([]);
                                            setSolvePath([]);
                                          }}
                                        >
                                          Reset progress
                                        </button>
                                        <button
                                          type="button"
                                          className="btn btn-primary"
                                          onClick={() => {
                                            setOpen(false);
                                          }}
                                        >
                                          Save and exit
                                        </button>
                                      </>
                                    );
                                  }}
                                </GridConsumer>
                              )}
                            </SolvePathConsumer>
                          </PerfectionScreen>
                        </GridContext>
                      </GridStateContext>
                    </EditContext>
                  </DisplayContext>
                </EmbedContext>
              );
            }}
          </GridConsumer>
        )}
      </div>
      <form method="dialog" className="modal-backdrop bg-neutral/55"></form>
    </dialog>
  );
});

export const type = undefined;
