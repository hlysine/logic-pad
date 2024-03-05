import GridData from '../grid';
import { Errors } from '../primitives';
import Rule from './rule';

export default abstract class SymbolRule extends Rule {
  public override validateGrid(_grid: GridData): Errors | null {
    return null; // disable grid validation because symbols are validated individually
  }

  public abstract validateSymbol(
    grid: GridData,
    x: number,
    y: number
  ): Errors | null;

  public abstract copyWith(props: { [key: string]: any }): SymbolRule;
}
