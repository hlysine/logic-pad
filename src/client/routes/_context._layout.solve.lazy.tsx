import InstructionList from '../instructions/InstructionList';
import EditControls from '../components/EditControls';
import MainGrid from '../grid/MainGrid';
import Metadata from '../metadata/Metadata';
import { createLazyFileRoute } from '@tanstack/react-router';
import { memo } from 'react';
import useLinkLoader from '../router/linkLoader';
import ThreePaneLayout from '../components/ThreePaneLayout.tsx';
import TouchControls from '../components/TouchControls';
import DocumentTitle from '../components/DocumentTitle';
import InstructionPartOutlet from '../instructions/InstructionPartOutlet';
import { PartPlacement } from '../instructions/parts/types';
import ForesightContext from '../contexts/ForesightContext.tsx';

export const Route = createLazyFileRoute('/_context/_layout/solve')({
  component: memo(function SolveMode() {
    const params = Route.useSearch();
    useLinkLoader(params, { allowEmpty: false });
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
