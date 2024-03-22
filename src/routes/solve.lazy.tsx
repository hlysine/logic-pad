import Instruction from '../ui/instructions/Instruction';
import InstructionList from '../ui/instructions/InstructionList';
import EditControls from '../ui/EditControls';
import MainGrid from '../ui/grid/MainGrid';
import Metadata from '../ui/metadata/Metadata';
import { createLazyFileRoute } from '@tanstack/react-router';
import { memo } from 'react';

export const Route = createLazyFileRoute('/solve')({
  component: memo(function SolveMode() {
    return (
      <div className="flex flex-1 justify-center items-center flex-wrap">
        <div className="w-[320px] flex flex-col p-4 gap-4 text-neutral-content self-stretch justify-between">
          <div className="flex flex-col gap-2 justify-self-stretch flex-1 justify-center">
            <Metadata />
          </div>
          <EditControls />
        </div>
        <div className="grow shrink flex justify-start items-center p-0">
          <div className="flex shrink-0 grow justify-center items-center m-0 p-0 border-0">
            <MainGrid editable={true} />
          </div>
        </div>
        <InstructionList>{Instruction}</InstructionList>
      </div>
    );
  }),
});
