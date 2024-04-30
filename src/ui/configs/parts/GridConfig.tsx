import { memo, useEffect, useState } from 'react';
import { ConfigType, GridConfig } from '../../../data/config';
import Instruction from '../../../data/instruction';
import GridData from '../../../data/grid';
import { FiExternalLink } from 'react-icons/fi';
import { cn } from '../../../utils';
import EmbedContext, { useEmbed } from '../../EmbedContext';
import PuzzleEditor from '../../editor/PuzzleEditor';
import GridContext, { GridConsumer, useGrid } from '../../GridContext';
import DisplayContext from '../../DisplayContext';
import EditContext from '../../EditContext';
import GridStateContext from '../../GridStateContext';

export interface GridConfigProps {
  instruction: Instruction;
  config: GridConfig;
  setConfig?: (field: string, value: GridConfig['default']) => void;
}

function EmbedLoader({ grid }: { grid: GridData }) {
  const { setFeatures } = useEmbed();
  const { setGrid } = useGrid();
  useEffect(() => {
    setFeatures({
      instructions: false,
      metadata: false,
    });
    setGrid(grid);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}

export default memo(function GridConfig({
  instruction,
  config,
  setConfig,
}: GridConfigProps) {
  const grid = instruction[
    config.field as keyof typeof instruction
  ] as unknown as GridData;
  const [open, setOpen] = useState(false);

  return (
    <div className="flex p-2 justify-between items-center">
      <span className="flex-1">{config.description}</span>
      <div className="flex flex-col gap-2">
        <button
          className="btn justify-start flex-nowrap flex"
          onClick={() => setOpen(true)}
        >
          Open editor
          <FiExternalLink size={24} />
        </button>

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
              <EmbedContext>
                <DisplayContext>
                  <EditContext>
                    <GridStateContext>
                      <GridContext>
                        <EmbedLoader grid={grid} />
                        <PuzzleEditor>
                          <GridConsumer>
                            {({ grid }) => {
                              return (
                                <button
                                  className="btn btn-primary"
                                  onClick={() => {
                                    setConfig?.(config.field, grid);
                                    setOpen(false);
                                  }}
                                >
                                  Save and exit
                                </button>
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
          </div>
          <form method="dialog" className="modal-backdrop bg-neutral/55">
            <button onClick={() => setOpen(false)}>close</button>
          </form>
        </dialog>
      </div>
    </div>
  );
});

export const type = ConfigType.Grid;
