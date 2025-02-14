import { Mode } from '@logic-pad/core/data/primitives';
import DocumentTitle from '../components/DocumentTitle';
import { SolveEditControls } from '../components/EditControls';
import ThreePaneLayout from '../components/ThreePaneLayout';
import TouchControls from '../components/TouchControls';
import ForesightContext from '../contexts/ForesightContext';
import { GridConsumer } from '../contexts/GridContext';
import MainGrid from '../grid/MainGrid';
import InstructionList from '../instructions/InstructionList';
import InstructionPartOutlet from '../instructions/InstructionPartOutlet';
import { PartPlacement } from '../instructions/parts/types';
import Metadata from '../metadata/Metadata';
import ModeVariantLoader from '../router/ModeVariantLoader';

export interface SolveScreenProps {
  children?: React.ReactNode;
}

export default function SolveScreen({ children }: SolveScreenProps) {
  return (
    <ForesightContext>
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
            <GridConsumer>
              {({ grid }) => (
                <InstructionPartOutlet
                  grid={grid}
                  placement={PartPlacement.LeftBottom}
                />
              )}
            </GridConsumer>
            {children}
            <TouchControls />
            <SolveEditControls />
            <ModeVariantLoader mode={Mode.Solve} />
          </>
        }
        center={<MainGrid useToolboxClick={false} />}
        right={<InstructionList />}
      />
    </ForesightContext>
  );
}
