import Instruction from '../ui/instructions/Instruction';
import InstructionList from '../ui/instructions/InstructionList';
import EditControls from '../ui/EditControls';
import MainGrid from '../ui/grid/MainGrid';
import Metadata from '../ui/metadata/Metadata';
import { createFileRoute } from '@tanstack/react-router';
import { memo } from 'react';
import useLinkLoader, { validateSearch } from '../ui/router/linkLoader';
import StupidGrid from '../ui/StupidGrid';
import HorizontalLayout from '../ui/HorizontalLayout';

export const Route = createFileRoute('/solve')({
  validateSearch,
  component: memo(function SolveMode() {
    const params = Route.useSearch();
    useLinkLoader(params);
    return (
      <HorizontalLayout
        left={
          <>
            <div className="flex flex-col gap-2 justify-self-stretch flex-1 justify-center">
              <Metadata />
              <StupidGrid />
            </div>
            <EditControls />
          </>
        }
        center={<MainGrid editable={true} />}
        right={<InstructionList>{Instruction}</InstructionList>}
      />
    );
  }),
});
