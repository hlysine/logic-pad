import { AnyConfig, ConfigType } from '../config';
import { GridChangeHandler } from '../events/onGridChange';
import { SetGridHandler } from '../events/onSetGrid';
import GridData from '../grid';
import { resize } from '../helper';
import { Color, RuleState, State } from '../primitives';
import CustomIconSymbol from '../symbols/customIconSymbol';
import TileData from '../tile';
import { ControlLine, Row } from './musicControlLine';
import Rule, { SearchVariant } from './rule';

const DEFAULT_SCALLE = [
  new Row('C5', 0.6),
  new Row('B4', 0.6),
  new Row('A4', 0.6),
  new Row('G4', 0.6),
  new Row('F4', 0.6),
  new Row('E4', 0.6),
  new Row('D4', 0.6),
  new Row('C4', 0.6),
];

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
      default: [new ControlLine(0, 120, false, DEFAULT_SCALLE)],
      field: 'controlLines',
      description: 'Control Lines',
      configurable: false,
    },
    {
      type: ConfigType.NullableGrid,
      default: null,
      nonNullDefault: new GridData(5, 4).addRule(
        new MusicGridRule(
          [new ControlLine(0, 120, false, DEFAULT_SCALLE)],
          null
        )
      ),
      field: 'track',
      description: 'Track',
      configurable: true,
    },
  ]);

  private static readonly SEARCH_VARIANTS = [
    new MusicGridRule(
      [new ControlLine(0, 120, false, DEFAULT_SCALLE)],
      null
    ).searchVariant(),
  ];

  /**
   * **Music Grid: Listen to the solution**
   * @param controlLines Denote changes in the playback settings. At least one control line at column 0 should be present to enable playback.
   * @param track The grid to be played when "listen" is clicked. Set as null to play the solution.
   */
  public constructor(
    public readonly controlLines: readonly ControlLine[],
    public readonly track: GridData | null
  ) {
    super();
    this.controlLines = controlLines;
    this.track = track;
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
          resize(line.rows, newGrid.height, () => new Row(null, null))
        )
      );
    return this.copyWith({ controlLines });
  }

  /**
   * Add or replace a control line.
   * @param controlLine The control line to set.
   * @returns A new rule with the control line set.
   */
  public setControlLine(controlLine: ControlLine): this {
    const controlLines = this.controlLines.filter(
      line => line.column !== controlLine.column
    );
    return this.copyWith({
      controlLines: [...controlLines, controlLine].sort(
        (a, b) => a.column - b.column
      ),
    });
  }

  public withTrack(track: GridData | null): this {
    return this.copyWith({ track });
  }

  public copyWith({
    controlLines,
    track,
  }: {
    controlLines?: readonly ControlLine[];
    track?: GridData | null;
  }): this {
    return new MusicGridRule(
      controlLines ?? this.controlLines,
      track !== undefined ? track : this.track
    ) as this;
  }

  public get validateWithSolution(): boolean {
    return true;
  }

  public get isSingleton(): boolean {
    return true;
  }
}

export const instance = new MusicGridRule(
  [new ControlLine(0, 120, false, DEFAULT_SCALLE)],
  null
);
