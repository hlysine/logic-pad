import {
  forwardRef,
  memo,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import { cn } from '../../uiHelper';
import EmbedContext from '../../contexts/EmbedContext';
import GridContext, { GridConsumer } from '../../contexts/GridContext';
import DisplayContext from '../../contexts/DisplayContext';
import GridStateContext from '../../contexts/GridStateContext';
import { Color, Position } from '@logic-pad/core/data/primitives';
import PerfectionRule from '@logic-pad/core/data/rules/perfectionRule';
import PerfectionScreen from '../../screens/PerfectionScreen';
import { instance as foresightInstance } from '@logic-pad/core/data/rules/foresightRule';
import EditContext from '../../contexts/EditContext';
import { useDelta } from 'react-delta-hooks';
import { GridData } from '@logic-pad/core/index';
import { Puzzle, PuzzleMetadata } from '@logic-pad/core/data/puzzle';
import { invokeSetGrid } from '@logic-pad/core/data/events/onSetGrid';

export interface SolvePathEditorModalProps {
  onChange: (solvePath: Position[]) => void;
}

export interface SolvePathEditorRef {
  open: (value: Position[], grid: GridData, metadata: PuzzleMetadata) => void;
}

function prepareGrid(
  grid: GridData,
  solvePath: Position[] | null
): { grid: GridData; solution: GridData | null } {
  const newGrid = grid.withRules(rules => [
    new PerfectionRule(),
    ...rules.filter(r => r.id !== foresightInstance.id),
  ]);
  if (solvePath) {
    const resetGrid = newGrid.withTiles(tiles =>
      tiles.map((row, y) =>
        row.map((tile, x) => {
          if (
            !tile.exists ||
            tile.fixed ||
            solvePath.some(p => p.x === x && p.y === y)
          ) {
            return tile;
          } else {
            return tile.withColor(Color.Gray);
          }
        })
      )
    );
    if (resetGrid.colorEquals(newGrid)) {
      return { grid: invokeSetGrid(resetGrid, newGrid, null), solution: null };
    } else {
      return {
        grid: invokeSetGrid(resetGrid, resetGrid, null),
        solution: newGrid,
      };
    }
  } else {
    const resetGrid = newGrid.resetTiles();
    if (resetGrid.colorEquals(newGrid)) {
      return { grid: invokeSetGrid(resetGrid, newGrid, null), solution: null };
    } else {
      return {
        grid: invokeSetGrid(resetGrid, resetGrid, null),
        solution: newGrid,
      };
    }
  }
}

export default memo(
  forwardRef<SolvePathEditorRef, SolvePathEditorModalProps>(
    function SolvePathEditorModal(
      { onChange }: SolvePathEditorModalProps,
      ref
    ) {
      /**
       * initialState also specifies the open state of the modal.
       */
      const [initialState, setInitialState] = useState<Puzzle | null>(null);
      const [tempSolvePath, setTempSolvePath] = useState<Position[]>([]);

      useImperativeHandle(ref, () => ({
        open: (value: Position[], grid: GridData, metadata: PuzzleMetadata) => {
          const { grid: newGrid, solution } = prepareGrid(grid, value);
          setInitialState({ ...metadata, grid: newGrid, solution });
          setTempSolvePath(value);
        },
      }));

      const openDelta = useDelta(initialState);
      useEffect(() => {
        if (!openDelta) return;
        if (!openDelta.curr && openDelta.prev) {
          onChange(tempSolvePath);
        }
      }, [onChange, openDelta, tempSolvePath]);

      return (
        <dialog
          id="gridModal"
          className={cn('modal', initialState && 'modal-open')}
        >
          <div className="modal-box w-[calc(100%-4rem)] h-full max-w-none bg-neutral text-neutral-content">
            <form method="dialog">
              <button
                aria-label="Close dialog"
                className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                onClick={() => setInitialState(null)}
              >
                ✕
              </button>
            </form>
            {initialState && (
              <EmbedContext name="solve-path-modal">
                <DisplayContext>
                  <EditContext>
                    <GridStateContext>
                      <GridContext
                        initialGrid={initialState.grid}
                        initialSolution={initialState.solution}
                        initialMetadata={() => {
                          const {
                            grid: _1,
                            solution: _2,
                            ...metadata
                          } = initialState;
                          return metadata;
                        }}
                      >
                        <PerfectionScreen
                          solvePath={tempSolvePath}
                          setSolvePath={setTempSolvePath}
                        >
                          <GridConsumer>
                            {({ setGrid: setInnerGrid }) => {
                              return (
                                <>
                                  <button
                                    type="button"
                                    className="btn"
                                    onClick={() => {
                                      const { grid, solution } = prepareGrid(
                                        initialState.grid,
                                        []
                                      );
                                      setInnerGrid(grid, solution);
                                      setTempSolvePath([]);
                                    }}
                                  >
                                    Reset progress
                                  </button>
                                  <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={() => {
                                      setInitialState(null);
                                    }}
                                  >
                                    Save and exit
                                  </button>
                                </>
                              );
                            }}
                          </GridConsumer>
                        </PerfectionScreen>
                      </GridContext>
                    </GridStateContext>
                  </EditContext>
                </DisplayContext>
              </EmbedContext>
            )}
          </div>
        </dialog>
      );
    }
  )
);

export const type = undefined;
