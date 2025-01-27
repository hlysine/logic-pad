import DocumentTitle from '../components/DocumentTitle';
import ThreePaneLayout from '../components/ThreePaneLayout';
import TouchControls from '../components/TouchControls';
import SolvePathContext from '../contexts/SolvePathContext';
import MainGrid from '../grid/MainGrid';
import InstructionList from '../instructions/InstructionList';
import InstructionPartOutlet from '../instructions/InstructionPartOutlet';
import { PartPlacement } from '../instructions/parts/types';
import Metadata from '../metadata/Metadata';

export interface PerfectionScreenProps {
  children?: React.ReactNode;
  alwaysAllowUndo?: boolean;
}

export default function PerfectionScreen({
  children,
  alwaysAllowUndo,
}: PerfectionScreenProps) {
  return (
    <SolvePathContext alwaysAllowUndo={alwaysAllowUndo}>
      <ThreePaneLayout
        left={
          <>
            <DocumentTitle>Logic Pad</DocumentTitle>
            <div className="flex flex-col gap-2 justify-self-stretch flex-1 justify-center">
              <Metadata />
              <InstructionPartOutlet placement={PartPlacement.LeftPanel} />
            </div>
            <InstructionPartOutlet placement={PartPlacement.LeftBottom} />
            <TouchControls />
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
