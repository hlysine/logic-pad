export enum Color {
  Black = 'black',
  White = 'white',
  None = 'none',
}

export default class TileData {
  public readonly exists: boolean = true;
  public readonly fixed: boolean = false;
  public readonly color: Color = Color.None;
  public readonly number?: number;

  public constructor(
    exists: boolean,
    fixed: boolean,
    color: Color,
    number?: number
  ) {
    this.exists = exists;
    this.fixed = fixed;
    this.color = color;
    this.number = number;
  }

  public static empty(): TileData {
    return new TileData(true, false, Color.None);
  }

  public copyWith({
    exists,
    fixed,
    color,
    number,
  }: {
    exists?: boolean;
    fixed?: boolean;
    color?: Color;
    number?: number;
  }): TileData {
    return new TileData(
      exists ?? this.exists,
      fixed ?? this.fixed,
      color ?? this.color,
      number ?? this.number
    );
  }

  public withExists(exists: boolean): TileData {
    return this.copyWith({ exists });
  }

  public withFixed(fixed: boolean): TileData {
    return this.copyWith({ fixed });
  }

  public withColor(color: Color): TileData {
    return this.copyWith({ color });
  }

  public withNumber(number: number): TileData {
    return this.copyWith({ number });
  }

  public get isFixed(): boolean {
    return this.fixed;
  }

  public get hasNumber(): boolean {
    return this.number !== undefined;
  }
}
