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

export const Route = createFileRoute('/solve')({
  validateSearch,
  component: memo(function SolveMode() {
    const params = Route.useSearch();
    useLinkLoader(params);
    return (
      <ThreePaneLayout
        left={
          <>
            <DocumentTitle>Logic Pad</DocumentTitle>
            <div className="flex flex-col gap-2 justify-self-stretch flex-1 justify-center">
              <Metadata />
            </div>
            <TouchControls />
            <EditControls />
          </>
        }
        center={<MainGrid editable={true} />}
        right={<InstructionList />}
      />
    );
  }),
});
