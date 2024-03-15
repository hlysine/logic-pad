import GridData from '../grid';
import { Errors } from '../primitives';
import Instruction from '../instruction';

export default abstract class Rule extends Instruction {
  public abstract validateGrid(grid: GridData): Errors | null | undefined;
}
