import DataObject from '../dataObject';
import GridData from '../grid';
import { Errors } from '../primitives';

export default abstract class Symbol extends DataObject {
  public constructor(
    public readonly x: number,
    public readonly y: number
  ) {
    super();
    this.x = x;
    this.y = y;
  }

  public abstract validateSymbol(grid: GridData): Errors | null;

  public abstract copyWith(props: { [key: string]: any }): this;

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
