import { memo } from 'react';
import InstructionData from '../../data/instruction';
import { State } from '../../data/primitives';
import InstructionBase from './InstructionBase';

export interface InstructionProps {
  instruction: InstructionData;
  state?: State;
}

export default memo(function Instruction({
  instruction,
  state,
}: InstructionProps) {
  return <InstructionBase instruction={instruction} state={state} />;
});
