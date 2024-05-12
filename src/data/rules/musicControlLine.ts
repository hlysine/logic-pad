import { AnyConfig, ConfigType } from '../config';
import Configurable from '../configurable';

export class Row extends Configurable {
  private static readonly CONFIGS: readonly AnyConfig[] = Object.freeze([
    {
      type: ConfigType.NullableNote,
      default: 'C4',
      field: 'note',
      description: 'Note',
      configurable: true,
    },
    {
      type: ConfigType.NullableNumber,
      default: 0.6,
      min: 0,
      max: 1,
      step: 0.2,
      field: 'velocity',
      description: 'Velocity',
      configurable: true,
    },
  ]);

  public constructor(
    /**
     * The note to play at this row, or null to keep the current note from the previous control line.
     * If this is null from the first control line, the note will be silent.
     */
    public readonly note: string | null,
    /**
     * The velocity to play the note at, or null to keep the current velocity from the previous control line.
     * Ranges from 0 to 1
     */
    public readonly velocity: number | null
  ) {
    super();
    this.note = note;
    this.velocity = velocity;
  }

  public get configs(): readonly AnyConfig[] | null {
    return Row.CONFIGS;
  }

  public copyWith({
    note,
    velocity,
  }: {
    note?: string | null;
    velocity?: number | null;
  }): this {
    return new Row(
      note !== undefined ? note : this.note,
      velocity !== undefined ? velocity : this.velocity
    ) as this;
  }
}

export class ControlLine extends Configurable {
  private static readonly CONFIGS: readonly AnyConfig[] = Object.freeze([
    {
      type: ConfigType.NullableNumber,
      default: 120,
      min: 20,
      max: 1000,
      field: 'bpm',
      description: 'BPM',
      configurable: true,
    },
    {
      type: ConfigType.NullableBoolean,
      default: false,
      field: 'pedal',
      description: 'Pedal',
      configurable: true,
    },
  ]);

  /**
   * Configure playback settings, taking effect at the given column (inclusive)
   * @param column The column at which the settings take effect
   * @param bpm The new beats per minute, or null to keep the current value from the previous control line
   * @param pedal Whether the pedal is pressed, or null to keep the current value from the previous control line
   * @param rows The notes to play at each row. This list is automatically resized to match the height of the grid. You may pass in an empty list if none of the rows need to be changed.
   */
  public constructor(
    public readonly column: number,
    public readonly bpm: number | null,
    public readonly pedal: boolean | null,
    public readonly rows: readonly Row[]
  ) {
    super();
    this.column = Math.floor(column);
    this.bpm = bpm;
    this.pedal = pedal;
    this.rows = rows;
  }

  public get configs(): readonly AnyConfig[] | null {
    return ControlLine.CONFIGS;
  }

  public copyWith({
    column,
    bpm,
    pedal,
    rows,
  }: {
    column?: number;
    bpm?: number | null;
    pedal?: boolean | null;
    rows?: readonly Row[];
  }): this {
    return new ControlLine(
      column ?? this.column,
      bpm !== undefined ? bpm : this.bpm,
      pedal !== undefined ? pedal : this.pedal,
      rows ?? this.rows
    ) as this;
  }

  public withColumn(column: number): this {
    return this.copyWith({ column });
  }

  public withBpm(bpm: number | null): this {
    return this.copyWith({ bpm });
  }

  public withPedal(pedal: boolean | null): this {
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

  public get isEmpty(): boolean {
    return (
      this.bpm === null &&
      this.pedal === null &&
      !this.rows.some(row => row.note !== null || row.velocity !== null)
    );
  }
}

export const instance = undefined;
