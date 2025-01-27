import { memo, useEffect } from 'react';
import GridData from '@logic-pad/core/data/grid';
import { cn } from '../../../client/uiHelper.ts';
import EmbedContext, { useEmbed } from '../../contexts/EmbedContext.tsx';
import PuzzleEditorScreen from '../../screens/PuzzleEditorScreen.tsx';
import GridContext, { GridConsumer } from '../../contexts/GridContext.tsx';
import DisplayContext from '../../contexts/DisplayContext.tsx';
import EditContext from '../../contexts/EditContext.tsx';
import GridStateContext from '../../contexts/GridStateContext.tsx';

export interface GridEditorModalProps {
  grid: GridData;
  setGrid: (grid: GridData) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}

function EmbedLoader() {
  const { setFeatures } = useEmbed();
  useEffect(() => {
    setFeatures({
      instructions: false,
      metadata: false,
      checklist: false,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}

export default memo(function GridEditorModal({
  grid,
  setGrid,
  open,
  setOpen,
}: GridEditorModalProps) {
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
            {({ grid: outerGrid }) => (
              <EmbedContext>
                <DisplayContext>
                  <EditContext>
                    <GridStateContext>
                      <GridContext grid={grid} solution={null}>
                        <EmbedLoader />
                        <PuzzleEditorScreen>
                          <GridConsumer>
                            {({ grid, setGrid: setInnerGrid }) => {
                              return (
                                <>
                                  <button
                                    type="button"
                                    className="btn"
                                    onClick={() => {
                                      setInnerGrid(outerGrid);
                                    }}
                                  >
                                    Copy from main grid
                                  </button>
                                  <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={() => {
                                      setGrid(grid);
                                      setOpen(false);
                                    }}
                                  >
                                    Save and exit
                                  </button>
                                </>
                              );
                            }}
                          </GridConsumer>
                        </PuzzleEditorScreen>
                      </GridContext>
                    </GridStateContext>
                  </EditContext>
                </DisplayContext>
              </EmbedContext>
            )}
          </GridConsumer>
        )}
      </div>
      <form method="dialog" className="modal-backdrop bg-neutral/55"></form>
    </dialog>
  );
});

export const type = undefined;
