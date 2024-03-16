import { memo } from 'react';
import Instruction from '../instructions/Instruction';
import InstructionList from '../instructions/InstructionList';
import EditControls from '../EditControls';
import MainGrid from '../grid/MainGrid';

export default memo(function SolveMode() {
  return (
    <div className="flex flex-1 justify-center items-center flex-wrap">
      <div className="w-[320px] flex flex-col p-4 gap-4 text-neutral-content self-stretch justify-between">
        <div className="flex flex-col gap-2">
          <div className="text-xl">Roadmap</div>
          <ul className="list-disc pl-4">
            <li className="line-through">Implement puzzle grid</li>
            <li className="line-through">
              Implement click and drag mouse input
            </li>
            <li className="line-through">Implement merged tiles</li>
            <li className="line-through">Implement rules UI</li>
            <li className="line-through">Implement color themes</li>
            <li>Add missing rules and symbols</li>
            <li>Implement logic for rules and symbols</li>
            <li>Implement win confirmation</li>
            <li className="line-through">Add undo and restart</li>
            <li>Add flood painting</li>
            <li>Implement puzzle serialization</li>
            <li>Optimize performance</li>
            <li>Puzzle editor</li>
            <li className="ml-4">Add color, fix and merge tools</li>
            <li className="ml-4">Add a tool for each symbol type</li>
            <li className="ml-4">Hide tools behind search bar</li>
            <li className="ml-4">Add configurations for each rule</li>
            <li className="ml-4">Hide rules behind search bar</li>
            <li className="ml-4">Add puzzle name and author fields</li>
          </ul>
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
});
