import { memo, useEffect, useState } from 'react';
import { cn } from '../../uiHelper';
import EmbedContext from '../../contexts/EmbedContext';
import GridContext, { GridConsumer } from '../../contexts/GridContext';
import DisplayContext from '../../contexts/DisplayContext';
import GridStateContext from '../../contexts/GridStateContext';
import { Position } from '@logic-pad/core/data/primitives';
import PerfectionRule, {
  instance as perfectionInstance,
} from '@logic-pad/core/data/rules/perfectionRule';
import PerfectionScreen from '../../screens/PerfectionScreen';
import { instance as foresightInstance } from '@logic-pad/core/data/rules/foresightRule';
import {
  SolvePathConsumer,
  useSolvePath,
} from '../../contexts/SolvePathContext';
import EditContext from '../../contexts/EditContext';
import { useDelta } from 'react-delta-hooks';

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

export default memo(function SolvePathEditorModal({
  solvePath,
  setSolvePath,
  open,
  setOpen,
}: SolvePathEditorModalProps) {
  const [tempSolvePath, setTempSolvePath] = useState(solvePath);

  const openDelta = useDelta(open);
  useEffect(() => {
    if (openDelta && !openDelta.curr && openDelta.prev) {
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
              const newGrid = outerGrid.withRules(rules => [
                new PerfectionRule(),
                ...rules.filter(r => r.id !== foresightInstance.id),
              ]);
              const resetGrid = newGrid.resetTiles();

              return (
                <EmbedContext>
                  <DisplayContext>
                    <EditContext>
                      <GridStateContext>
                        <GridContext
                          grid={resetGrid}
                          solution={resetGrid.equals(newGrid) ? null : newGrid}
                          metadata={metadata}
                        >
                          <PerfectionScreen alwaysAllowUndo={true}>
                            <EmbedLoader solvePath={solvePath} />
                            <GridConsumer>
                              {({ grid }) => {
                                // exit the modal if the user undo's too far
                                if (
                                  !grid.findRule(
                                    r => r.id === perfectionInstance.id
                                  )
                                )
                                  setOpen(false);
                                return null;
                              }}
                            </GridConsumer>
                            <SolvePathConsumer>
                              {({ solvePath: newSolvePath }) => {
                                if (newSolvePath !== tempSolvePath)
                                  setTempSolvePath(newSolvePath);
                                return null;
                              }}
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
