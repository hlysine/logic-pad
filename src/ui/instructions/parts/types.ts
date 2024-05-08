import Instruction from '../../../data/instruction';

export enum PartPlacement {
  LeftPanel = 'left-panel',
  GridOverlay = 'grid-overlay',
}

export interface PartSpec {
  placement: PartPlacement;
  instructionId: string;
}

export interface InstructionPartProps<T extends Instruction> {
  instruction: T;
}
