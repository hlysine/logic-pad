import GridData from '../grid';
import { RuleState } from '../primitives';
import Instruction from '../instruction';

export default abstract class Rule extends Instruction {
  public abstract validateGrid(grid: GridData): RuleState;
}
