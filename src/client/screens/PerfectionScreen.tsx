import DocumentTitle from '../components/DocumentTitle';
import EditControls from '../components/EditControls';
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

export interface PerfectionScreenProps {
  children?: React.ReactNode;
  solvePath?: Position[];
  setSolvePath?: (solvePath: Position[]) => void;
}

export default function PerfectionScreen({
  children,
  solvePath,
  setSolvePath,
}: PerfectionScreenProps) {
  return (
    <SolvePathContext solvePath={solvePath} setSolvePath={setSolvePath}>
      <ThreePaneLayout
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
            <GridConsumer>
              {({ grid }) => (
                <InstructionPartOutlet
                  grid={grid}
                  placement={PartPlacement.LeftBottom}
                />
              )}
            </GridConsumer>
            <TouchControls />
            <EditControls />
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
              {children}
            </div>
          </>
        }
      />
    </SolvePathContext>
  );
}
