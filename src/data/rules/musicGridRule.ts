import { GridChangeHandler } from '../events/onGridChange';
import { SetGridHandler } from '../events/onSetGrid';
import GridData from '../grid';
import { resize } from '../helper';
import { Color, RuleState, State } from '../primitives';
import CustomIconSymbol from '../symbols/customIconSymbol';
import TileData from '../tile';
import Rule, { SearchVariant } from './rule';

export interface Row {
  readonly note: string | undefined;
  readonly velocity: number | undefined;
}

export class ControlLine {
  public constructor(
    public readonly column: number,
    public readonly bpm: number | undefined,
    public readonly pedal: boolean | undefined,
    public readonly rows: readonly Row[]
  ) {
    this.column = column;
    this.bpm = bpm;
    this.pedal = pedal;
    this.rows = rows;
  }

  public copyWith({
    column,
    bpm,
    pedal,
    rows,
  }: {
    column?: number;
    bpm?: number | undefined;
    pedal?: boolean | undefined;
    rows?: readonly Row[];
  }): this {
    return new ControlLine(
      column ?? this.column,
      bpm ?? this.bpm,
      pedal ?? this.pedal,
      rows ?? this.rows
    ) as this;
  }

  public withColumn(column: number): this {
    return this.copyWith({ column });
  }

  public withBpm(bpm: number | undefined): this {
    return this.copyWith({ bpm });
  }

  public withPedal(pedal: boolean | undefined): this {
    return this.copyWith({ pedal });
  }

  public withRows(rows: readonly Row[]): this {
    return this.copyWith({ rows });
  }

  public equals(other: ControlLine): boolean {
    return (
      this.column === other.column &&
      this.bpm === other.bpm &&
      this.pedal === other.pedal &&
      this.rows.length === other.rows.length &&
      this.rows.every((row, i) => {
        const otherRow = other.rows[i];
        return row.note === otherRow.note && row.velocity === otherRow.velocity;
      })
    );
  }
}

export default class MusicGridRule
  extends Rule
  implements GridChangeHandler, SetGridHandler
{
  private static readonly EXAMPLE_GRID = Object.freeze(
    new GridData(1, 1)
      .withTiles([[new TileData(false, false, Color.Dark)]])
      .addSymbol(
        new CustomIconSymbol('', GridData.create([]), 0, 0, 'MdMusicNote')
      )
  );

  private static readonly SEARCH_VARIANTS = [
    new MusicGridRule([]).searchVariant(),
  ];

  /**
   * **Music Grid: Listen and deduce**
   */
  public constructor(public readonly controlLines: readonly ControlLine[]) {
    super();
    this.controlLines = controlLines;
  }

  public get id(): string {
    return `music`;
  }

  public get explanation(): string {
    return `*Music Grid:* Listen and deduce`;
  }

  public createExampleGrid(): GridData {
    return MusicGridRule.EXAMPLE_GRID;
  }

  public get searchVariants(): SearchVariant[] {
    return MusicGridRule.SEARCH_VARIANTS;
  }

  public validateGrid(_grid: GridData): RuleState {
    return { state: State.Incomplete };
  }

  public onSetGrid(_oldGrid: GridData, newGrid: GridData): GridData {
    if (newGrid.getTileCount(true, undefined, Color.Gray) === 0) return newGrid;
    const tiles = newGrid.tiles.map(row =>
      row.map(tile => tile.withColor(Color.Light))
    );
    return newGrid.copyWith({ tiles });
  }

  public onGridChange(newGrid: GridData): this {
    if (this.controlLines.length === 0) return this;
    if (
      newGrid.height === this.controlLines[0].rows.length &&
      !this.controlLines.some(line => line.column >= newGrid.width)
    )
      return this;
    const controlLines = this.controlLines
      .filter(line => line.column < newGrid.width)
      .map(line =>
        line.withRows(
          resize(line.rows, Math.max(line.rows.length, newGrid.height), () => ({
            note: undefined,
            velocity: undefined,
          }))
        )
      );
    return this.copyWith({ controlLines });
  }

  public copyWith({
    controlLines,
  }: {
    controlLines?: readonly ControlLine[];
  }): this {
    return new MusicGridRule(controlLines ?? this.controlLines) as this;
  }

  public get validateWithSolution(): boolean {
    return true;
  }
}

export const instance = new MusicGridRule([new ControlLine(0, 120, false, [])]);
