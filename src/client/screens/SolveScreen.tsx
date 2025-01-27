import DocumentTitle from '../components/DocumentTitle';
import EditControls from '../components/EditControls';
import ThreePaneLayout from '../components/ThreePaneLayout';
import TouchControls from '../components/TouchControls';
import ForesightContext from '../contexts/ForesightContext';
import MainGrid from '../grid/MainGrid';
import InstructionList from '../instructions/InstructionList';
import InstructionPartOutlet from '../instructions/InstructionPartOutlet';
import { PartPlacement } from '../instructions/parts/types';
import Metadata from '../metadata/Metadata';

export interface SolveScreenProps {
  children?: React.ReactNode;
}

export default function SolveScreen({ children }: SolveScreenProps) {
  return (
    <ForesightContext>
      <ThreePaneLayout
        left={
          <>
            <DocumentTitle>Logic Pad</DocumentTitle>
            <div className="flex flex-col gap-2 justify-self-stretch flex-1 justify-center">
              <Metadata />
              <InstructionPartOutlet placement={PartPlacement.LeftPanel} />
            </div>
            <InstructionPartOutlet placement={PartPlacement.LeftBottom} />
            {children}
            <TouchControls />
            <EditControls />
          </>
        }
        center={<MainGrid useToolboxClick={false} />}
        right={<InstructionList />}
      />
    </ForesightContext>
  );
}
