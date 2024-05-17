import Instruction from '../../../data/instruction';

export enum PartPlacement {
  LeftPanel = 'left-panel',
  LeftBottom = 'left-bottom',
  GridOverlay = 'grid-overlay',
  Toolbox = 'toolbox',
}

export interface PartSpec {
  placement: PartPlacement;
  instructionId: string;
}

export interface InstructionPartProps<T extends Instruction> {
  instruction: T;
}
