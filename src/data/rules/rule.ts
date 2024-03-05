import GridData from '../grid';
import { Errors } from '../primitives';
import DataObject from './dataObject';

export default abstract class Rule extends DataObject {
  public abstract validateGrid(grid: GridData): Errors | null;

  public abstract copyWith(props: { [key: string]: any }): Rule;
}
