import InstructionList from '../ui/instructions/InstructionList';
import EditControls from '../ui/components/EditControls';
import MainGrid from '../ui/grid/MainGrid';
import Metadata from '../ui/metadata/Metadata';
import { createFileRoute } from '@tanstack/react-router';
import { memo } from 'react';
import useLinkLoader, { validateSearch } from '../ui/router/linkLoader';
import ThreePaneLayout from '../ui/ThreePaneLayout';
import TouchControls from '../ui/components/TouchControls';
import DocumentTitle from '../ui/components/DocumentTitle';
import InstructionPartOutlet from '../ui/instructions/InstructionPartOutlet';
import { PartPlacement } from '../ui/instructions/parts/types';
import ForesightContext from '../ui/ForesightContext';

export const Route = createFileRoute('/_layout/solve')({
  validateSearch,
  component: memo(function SolveMode() {
    const params = Route.useSearch();
    useLinkLoader(params);
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
              <TouchControls />
              <EditControls />
            </>
          }
          center={<MainGrid useToolboxClick={false} />}
          right={<InstructionList />}
        />
      </ForesightContext>
    );
  }),
});
