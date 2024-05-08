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

export const instance = undefined;
