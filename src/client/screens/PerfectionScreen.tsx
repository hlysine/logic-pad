import { PerfectionEditControls } from '../components/EditControls';
import ThreePaneLayout from '../components/ThreePaneLayout';
import TouchControls from '../components/TouchControls';
import { GridConsumer } from '../contexts/GridContext';
import SolvePathContext from '../contexts/SolvePathContext';
import MainGrid from '../grid/MainGrid';
import InstructionList from '../instructions/InstructionList';
import InstructionPartOutlet from '../instructions/InstructionPartOutlet';
import { PartPlacement } from '../instructions/parts/types';
import Metadata from '../metadata/Metadata';
import { Mode, Position } from '@logic-pad/core/data/primitives';
import ModeVariantLoader from '../router/ModeVariantLoader';
import { memo } from 'react';
import DocumentTitle from '../components/DocumentTitle';
import PuzzleLoveButton from '../components/quickActions/PuzzleLoveButton';
import SharePuzzleImage from '../components/quickActions/SharePuzzleImage';
import PuzzleEditButton from '../components/quickActions/PuzzleEditButton';
import PuzzleSolveControl from '../components/PuzzleSolveControl';

export interface PerfectionScreenProps {
  quickActions?: React.ReactNode;
  children?: React.ReactNode;
  topLeft?: React.ReactNode;
  solvePath?: Position[];
  setSolvePath?: (solvePath: Position[]) => void;
  onReset?: () => void;
}

export default memo(function PerfectionScreen({
  quickActions,
  children,
  topLeft,
  solvePath,
  setSolvePath,
  onReset,
}: PerfectionScreenProps) {
  return (
    <SolvePathContext solvePath={solvePath} setSolvePath={setSolvePath}>
      <ThreePaneLayout
        collapsible={false}
        left={
          <>
            <DocumentTitle>Logic Pad</DocumentTitle>
            {topLeft}
            <div className="flex flex-col gap-2 justify-self-stretch flex-1 justify-center">
              <Metadata />
              <GridConsumer>
                {({ grid }) => (
                  <InstructionPartOutlet
                    grid={grid}
                    placement={PartPlacement.LeftPanel}
                  />
                )}
              </GridConsumer>
            </div>
            <GridConsumer>
              {({ grid }) => (
                <InstructionPartOutlet
                  grid={grid}
                  placement={PartPlacement.LeftBottom}
                />
              )}
            </GridConsumer>
            <div className="flex gap-1">
              <PuzzleLoveButton />
              <SharePuzzleImage />
              <PuzzleEditButton />
              {quickActions}
            </div>
            <TouchControls />
            <PerfectionEditControls onReset={onReset} />
            <ModeVariantLoader mode={Mode.Perfection} />
          </>
        }
        center={<MainGrid useToolboxClick={false} />}
        right={
          <>
            <div className="h-full flex flex-col items-stretch justify-center gap-4">
              <InstructionList />
            </div>
            <div className="p-2 w-full flex flex-col items-stretch justify-end gap-2 shrink-0">
              <PuzzleSolveControl />
              {children}
            </div>
          </>
        }
      />
    </SolvePathContext>
  );
});
