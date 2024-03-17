import GridData from '../../grid';
import { State } from '../../primitives';
import Symbol from '../symbol';

/**
 * A sign is a symbol that is only used for illustrative purposes.
 * They should only appear in example grids of other instructions.
 */
export default abstract class Sign extends Symbol {
  public validateSymbol(_grid: GridData): State {
    return State.Incomplete;
  }
}
