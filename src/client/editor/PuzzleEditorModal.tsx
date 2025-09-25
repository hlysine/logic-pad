import { memo, Ref, useEffect, useImperativeHandle, useState } from 'react';
import GridData from '@logic-pad/core/data/grid';
import { cn } from '../../client/uiHelper.ts';
import EmbedContext from '../contexts/EmbedContext.tsx';
import PuzzleEditorScreen from '../screens/PuzzleEditorScreen.tsx';
import GridContext, { defaultGrid } from '../contexts/GridContext.tsx';
import DisplayContext from '../contexts/DisplayContext.tsx';
import EditContext from '../contexts/EditContext.tsx';
import GridStateContext from '../contexts/GridStateContext.tsx';
import { useDelta } from 'react-delta-hooks';
import FullScreenModal from '../components/FullScreenModal.tsx';
import OnlineContext from '../contexts/OnlineContext.tsx';
import { PuzzleMetadata } from '@logic-pad/core/data/puzzle.ts';
import SolverContext from '../contexts/SolverContext.tsx';
import InstructionPartsContext from '../contexts/InstructionPartsContext.tsx';

export interface PuzzleEditorRef {
  open: (metadata: PuzzleMetadata, gridWithSolution: GridData) => void;
}

export interface PuzzleEditorModalProps {
  onChange: (metadata: PuzzleMetadata, gridWithSolution: GridData) => void;
  ref?: Ref<PuzzleEditorRef>;
}

export default memo(function PuzzleEditorModal({
  onChange,
  ref,
}: PuzzleEditorModalProps) {
  const [open, setOpen] = useState(false);
  const [tempMetadata, setTempMetadata] = useState<PuzzleMetadata>(() => ({
    title: '',
    description: '',
    author: '',
    difficulty: 0,
  }));
  const [tempGrid, setTempGrid] = useState<GridData>(defaultGrid);

  useImperativeHandle(ref, () => ({
    open: (metadata: PuzzleMetadata, gridWithSolution: GridData) => {
      setTempMetadata(metadata);
      setTempGrid(gridWithSolution);
      setOpen(true);
    },
  }));

  const openDelta = useDelta(open);
  useEffect(() => {
    if (!openDelta) return;
    if (openDelta.prev && !openDelta.curr) {
      onChange(tempMetadata, tempGrid);
    }
  }, [onChange, openDelta, tempMetadata, tempGrid]);

  return (
    open && (
      <FullScreenModal
        title="Edit puzzle"
        className={cn('modal', open && 'modal-open')}
        onClose={() => setOpen(false)}
      >
        <EmbedContext
          name="grid-modal"
          features={() => ({
            instructions: true,
            metadata: true,
            checklist: true,
            saveControl: false,
            preview: true,
          })}
        >
          <OnlineContext forceOffline={true}>
            <DisplayContext>
              <EditContext>
                <GridStateContext>
                  <GridContext
                    grid={tempGrid}
                    setGrid={setTempGrid}
                    metadata={tempMetadata}
                    setMetadata={setTempMetadata}
                  >
                    <SolverContext>
                      <InstructionPartsContext>
                        <PuzzleEditorScreen>
                          <button
                            type="button"
                            className="btn btn-primary"
                            onClick={() => {
                              setOpen(false);
                            }}
                          >
                            Save and exit
                          </button>
                        </PuzzleEditorScreen>
                      </InstructionPartsContext>
                    </SolverContext>
                  </GridContext>
                </GridStateContext>
              </EditContext>
            </DisplayContext>
          </OnlineContext>
        </EmbedContext>
      </FullScreenModal>
    )
  );
});
