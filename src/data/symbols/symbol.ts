import GridData from '../grid';
import Instruction from '../instruction';
import { State } from '../primitives';

export default abstract class Symbol extends Instruction {
  public constructor(
    public readonly x: number,
    public readonly y: number
  ) {
    super();
    this.x = x;
    this.y = y;
  }

  public abstract validateSymbol(grid: GridData): State;

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
