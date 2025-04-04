import { GridResizeHandler } from '../events/onGridResize.js';
import GridData from '../grid.js';
import Instruction from '../instruction.js';
import { Mode, State } from '../primitives.js';

export default abstract class Symbol
  extends Instruction
  implements GridResizeHandler
{
  public constructor(
    public readonly x: number,
    public readonly y: number
  ) {
    super();
    this.x = x;
    this.y = y;
  }

  public abstract validateSymbol(
    grid: GridData,
    solution: GridData | null
  ): State;

  public modeVariant(_mode: Mode): Symbol | null {
    return this as Symbol;
  }

  public onGridResize(
    _grid: GridData,
    mode: 'insert' | 'remove',
    direction: 'row' | 'column',
    index: number
  ): this | null {
    if (mode === 'insert') {
      return this.copyWith({
        x: direction === 'column' && this.x >= index ? this.x + 1 : this.x,
        y: direction === 'row' && this.y >= index ? this.y + 1 : this.y,
      });
    } else {
      if (direction === 'column' && this.x === index) return null;
      if (direction === 'row' && this.y === index) return null;
      return this.copyWith({
        x: direction === 'column' && this.x > index ? this.x - 1 : this.x,
        y: direction === 'row' && this.y > index ? this.y - 1 : this.y,
      });
    }
  }

  /**
   * The step size for the x and y coordinates of the symbol.
   */
  public get placementStep(): number {
    return 0.5;
  }

  /**
   * The order in which symbols are displayed on the instruction list. Lower values are displayed first.
   */
  public get sortOrder(): number {
    return this.id.charCodeAt(0);
  }

  public withX(x: number): this {
    return this.copyWith({ x });
  }

  public withY(y: number): this {
    return this.copyWith({ y });
  }

  public withPosition(x: number, y: number): this {
    return this.copyWith({ x, y });
  }
}

export const instance = undefined;
