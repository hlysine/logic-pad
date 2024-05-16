import { memo, useEffect } from 'react';
import GridData from '../../../data/grid';
import { cn } from '../../../utils';
import EmbedContext, { useEmbed } from '../../EmbedContext';
import PuzzleEditor from '../../editor/PuzzleEditor';
import GridContext, { GridConsumer, useGrid } from '../../GridContext';
import DisplayContext from '../../DisplayContext';
import EditContext from '../../EditContext';
import GridStateContext from '../../GridStateContext';

export interface GridEdittorModalProps {
  grid: GridData;
  setGrid: (grid: GridData) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}

function EmbedLoader({ grid }: { grid: GridData }) {
  const { setFeatures } = useEmbed();
  const { setGrid } = useGrid();
  useEffect(() => {
    setFeatures({
      instructions: false,
      metadata: false,
      checklist: false,
    });
    setGrid(grid, null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}

export default memo(function GridConfig({
  grid,
  setGrid,
  open,
  setOpen,
}: GridEdittorModalProps) {
  return (
    <dialog id="my_modal_2" className={cn('modal', open && 'modal-open')}>
      <div className="modal-box w-[calc(100%-4rem)] h-full max-w-none bg-neutral">
        <form method="dialog">
          <button
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
                      <GridContext>
                        <EmbedLoader grid={grid} />
                        <PuzzleEditor>
                          <GridConsumer>
                            {({ grid, setGrid: setInnerGrid }) => {
                              return (
                                <>
                                  <button
                                    className="btn"
                                    onClick={() => {
                                      setInnerGrid(outerGrid);
                                    }}
                                  >
                                    Copy from main grid
                                  </button>
                                  <button
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
                        </PuzzleEditor>
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
