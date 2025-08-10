import { Mode } from '@logic-pad/core/data/primitives';
import DocumentTitle from '../components/DocumentTitle';
import { SolveEditControls } from '../components/EditControls';
import ThreePaneLayout from '../components/ThreePaneLayout';
import TouchControls from '../components/TouchControls';
import { GridConsumer } from '../contexts/GridContext';
import MainGrid from '../grid/MainGrid';
import InstructionList from '../instructions/InstructionList';
import InstructionPartOutlet from '../instructions/InstructionPartOutlet';
import { PartPlacement } from '../instructions/parts/types';
import Metadata from '../metadata/Metadata';
import ModeVariantLoader from '../router/ModeVariantLoader';
import { memo } from 'react';
import SharePuzzleImage from '../components/quickActions/SharePuzzleImage';
import OnlineMetadata from '../metadata/OnlineMetadata';
import PuzzleLoveButton from '../components/quickActions/PuzzleLoveButton';
import PuzzleSolveControl from '../components/PuzzleSolveControl';
import PuzzleEditButton from '../components/quickActions/PuzzleEditButton';

export interface SolveScreenProps {
  quickActions?: React.ReactNode;
  children?: React.ReactNode;
}

export default memo(function SolveScreen({
  quickActions,
  children,
}: SolveScreenProps) {
  return (
    <ThreePaneLayout
      collapsible={false}
      left={
        <>
          <DocumentTitle>Logic Pad</DocumentTitle>
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
          <OnlineMetadata />
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
          <SolveEditControls />
          <ModeVariantLoader mode={Mode.Solve} />
        </>
      }
      center={<MainGrid useToolboxClick={false} />}
      right={
        <>
          <div className="h-full flex flex-col items-center justify-center gap-4">
            <InstructionList />
          </div>
          <div className="pb-2 w-full flex flex-col self-center items-stretch justify-end gap-2 shrink-0 max-w-[320px]">
            <PuzzleSolveControl />
            {children}
          </div>
        </>
      }
    />
  );
});
