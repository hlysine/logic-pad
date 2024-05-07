import { memo, useRef } from 'react';
import { getInstructionLocation, useConfig } from '../ConfigContext';
import Instruction from '../../data/instruction';
import { useGrid } from '../GridContext';

export interface EditTargetProps {
  instruction: Instruction;
}

export default memo(function EditTarget({ instruction }: EditTargetProps) {
  const { setLocation, setRef } = useConfig();
  const { grid } = useGrid();
  const divRef = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={divRef}
      className="absolute inset-0 cursor-pointer"
      onPointerDown={() => {
        setLocation(getInstructionLocation(grid, instruction));
        setRef(divRef);
      }}
    ></div>
  );
});
