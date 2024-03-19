import { memo } from 'react';
import InstructionList from '../instructions/InstructionList';
import EditControls from '../EditControls';
import MainGrid from '../grid/MainGrid';
import EditableInstruction from '../instructions/EditableInstruction';
import RulerOverlay from '../grid/RulerOverlay';
import { useGrid } from '../GridContext';
import InstructionSearch from '../instructions/InstructionSearch';

export default memo(function CreateMode() {
  const { grid } = useGrid();
  return (
    <div className="flex flex-1 justify-center items-center flex-wrap">
      <div className="w-[320px] flex flex-col p-4 gap-4 text-neutral-content self-stretch justify-between">
        <div className="flex flex-col gap-2">
          <div className="text-xl">Puzzle editor coming soon...</div>
        </div>
        <EditControls />
      </div>
      <div className="grow shrink flex justify-start items-center p-0">
        <div className="flex shrink-0 grow justify-center items-center m-0 p-0 border-0">
          <MainGrid editable={true}>
            <RulerOverlay width={grid.width} height={grid.height} />
          </MainGrid>
        </div>
      </div>
      <div className="flex flex-col items-stretch self-stretch justify-center gap-4">
        <InstructionSearch />
        <InstructionList>{EditableInstruction}</InstructionList>
      </div>
    </div>
  );
});
