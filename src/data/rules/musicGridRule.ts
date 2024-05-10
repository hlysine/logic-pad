import { AnyConfig, ConfigType } from '../config';
import { GridChangeHandler } from '../events/onGridChange';
import { SetGridHandler } from '../events/onSetGrid';
import GridData from '../grid';
import { resize } from '../helper';
import { Color, RuleState, State } from '../primitives';
import CustomIconSymbol from '../symbols/customIconSymbol';
import TileData from '../tile';
import { ControlLine } from './musicControlLine';
import Rule, { SearchVariant } from './rule';

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

  private static readonly CONFIGS: readonly AnyConfig[] = Object.freeze([
    {
      type: ConfigType.ControlLines,
      default: [new ControlLine(0, 120, false, [])],
      field: 'controlLines',
      description: 'Control Lines',
      configurable: false,
    },
  ]);

  private static readonly SEARCH_VARIANTS = [
    new MusicGridRule([]).searchVariant(),
  ];

  /**
   * **Music Grid: Listen to the solution**
   * @param controlLines Denote changes in the playback settings. At least one control line at column 0 should be present to enable playback.
   */
  public constructor(public readonly controlLines: readonly ControlLine[]) {
    super();
    this.controlLines = controlLines;
  }

  public get id(): string {
    return `music`;
  }

  public get explanation(): string {
    return `*Music Grid:* Listen to the solution`;
  }

  public get configs(): readonly AnyConfig[] | null {
    return MusicGridRule.CONFIGS;
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
      row.map(tile =>
        tile.color === Color.Gray ? tile.withColor(Color.Light) : tile
      )
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

  public get isSingleton(): boolean {
    return true;
  }
}

export const instance = new MusicGridRule([new ControlLine(0, 120, false, [])]);
