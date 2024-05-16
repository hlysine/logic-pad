import { AnyConfig, ConfigType } from '../config';
import { GridChangeHandler } from '../events/onGridChange';
import { GridResizeHandler } from '../events/onGridResize';
import { SetGridHandler } from '../events/onSetGrid';
import GridData from '../grid';
import { resize } from '../helper';
import { Color, RuleState, State } from '../primitives';
import CustomIconSymbol from '../symbols/customIconSymbol';
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
  implements GridChangeHandler, SetGridHandler, GridResizeHandler
{
  private static readonly EXAMPLE_GRID = Object.freeze(
    GridData.create(['.']).addSymbol(
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
    this.controlLines = MusicGridRule.deduplicateControlLines(controlLines);
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

  public onGridResize(
    _grid: GridData,
    mode: 'insert' | 'remove',
    direction: 'row' | 'column',
    index: number
  ): this | null {
    if (mode === 'insert') {
      if (direction === 'row') {
        return this.copyWith({
          controlLines: this.controlLines.map(line => {
            const rows = line.rows.slice();
            rows.splice(index, 0, new Row(null, null));
            return line.withRows(rows);
          }),
        });
      } else if (direction === 'column') {
        return this.copyWith({
          controlLines: this.controlLines.map(line =>
            line.column >= index ? line.withColumn(line.column + 1) : line
          ),
        });
      }
    } else if (mode === 'remove') {
      if (direction === 'row') {
        return this.copyWith({
          controlLines: this.controlLines.map(line =>
            line.withRows(line.rows.filter((_, idx) => idx !== index))
          ),
        });
      } else if (direction === 'column') {
        const lines: ControlLine[] = [];
        for (const line of this.controlLines) {
          if (line.column === index) {
            const nextLine = this.controlLines.find(
              l => l.column === index + 1
            );
            if (nextLine) {
              lines.push(MusicGridRule.mergeControlLines(line, nextLine));
            } else {
              lines.push(line.withColumn(index));
            }
          } else if (line.column > index) {
            lines.push(line.withColumn(line.column - 1));
          } else {
            lines.push(line);
          }
        }
        return this.copyWith({ controlLines: lines });
      }
    }
    return this;
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

  public static mergeControlLines(...lines: ControlLine[]): ControlLine {
    const rows = Array.from(
      { length: Math.max(...lines.map(l => l.rows.length)) },
      (_, idx) => {
        const note = lines
          .map(l => l.rows[idx]?.note)
          .reduce((a, b) => b ?? a, null);
        const velocity = lines
          .map(l => l.rows[idx]?.velocity)
          .reduce((a, b) => b ?? a, null);
        return new Row(note, velocity);
      }
    );
    const bpm = lines.map(l => l.bpm).reduce((a, b) => b ?? a, null);
    const pedal = lines.map(l => l.pedal).reduce((a, b) => b ?? a, null);
    return new ControlLine(lines[0].column, bpm, pedal, rows);
  }

  public static deduplicateControlLines(
    lines: readonly ControlLine[]
  ): ControlLine[] {
    const columns = new Map<number, ControlLine[]>();
    for (const line of lines) {
      if (!columns.has(line.column)) {
        columns.set(line.column, [line]);
      } else {
        columns.get(line.column)!.push(line);
      }
    }
    return Array.from(columns.values()).map(lines =>
      lines.length > 1 ? MusicGridRule.mergeControlLines(...lines) : lines[0]
    );
  }
}

export const instance = new MusicGridRule(
  [new ControlLine(0, 120, false, DEFAULT_SCALLE)],
  null
);
