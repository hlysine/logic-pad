import GridData from '../grid';
import { Color, Errors } from '../primitives';
import Rule from './rule';

export default class ConnectAllRule extends Rule {
  private static EXAMPLE_GRID_LIGHT = GridData.create([
    'bwwwb',
    'bwbww',
    'wwwbb',
    'wbwww',
  ]);

  private static EXAMPLE_GRID_DARK = GridData.create([
    'wbbbw',
    'wbwbb',
    'bbbww',
    'bwbbb',
  ]);

  public constructor(public readonly color: Color) {
    super();
    this.color = color;
  }

  public get id(): string {
    return `connect_all`;
  }

  public get explanation(): string {
    return `Connect all ${this.color} cells`;
  }

  public get exampleGrid(): GridData {
    return this.color === Color.Light
      ? ConnectAllRule.EXAMPLE_GRID_LIGHT
      : ConnectAllRule.EXAMPLE_GRID_DARK;
  }

  public validateGrid(_grid: GridData): Errors | null | undefined {
    throw new Error('Method not implemented.');
  }

  public copyWith({ color }: { color?: Color }): this {
    return new ConnectAllRule(color ?? this.color) as this;
  }

  public withColor(color: Color): this {
    return this.copyWith({ color });
  }
}
