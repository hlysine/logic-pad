export interface Row {
  /**
   * The note to play at this row, or undefined to keep the current note from the previous control line.
   * If this is undefined from the first control line, the note will be silent.
   */
  readonly note: string | undefined;
  /**
   * The velocity to play the note at, or undefined to keep the current velocity from the previous control line.
   * Ranges from 0 to 1
   */
  readonly velocity: number | undefined;
}

export class ControlLine {
  /**
   * Configure playback settings, taking effect at the given column (inclusive)
   * @param column The column at which the settings take effect
   * @param bpm The new beats per minute, or undefined to keep the current value from the previous control line
   * @param pedal Whether the pedal is pressed, or undefined to keep the current value from the previous control line
   * @param rows The notes to play at each row. Must have the same length as the grid height
   */
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

export const instance = undefined;
