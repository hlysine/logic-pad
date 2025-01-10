import { Color } from './primitives.js';

export default class TileData {
  public constructor(
    public readonly exists: boolean,
    public readonly fixed: boolean,
    public readonly color: Color
  ) {
    this.exists = exists;
    this.fixed = fixed;
    this.color = color;
  }

  /**
   * Create a gray tile.
   */
  public static empty(): TileData {
    return new TileData(true, false, Color.Gray);
  }

  /**
   * Create a non-existent tile.
   */
  public static doesNotExist(): TileData {
    return new TileData(false, false, Color.Gray);
  }

  public copyWith({
    exists,
    fixed,
    color,
  }: {
    exists?: boolean;
    fixed?: boolean;
    color?: Color;
  }): this {
    return new TileData(
      exists ?? this.exists,
      fixed ?? this.fixed,
      color ?? this.color
    ) as this;
  }

  public withExists(exists: boolean): this {
    return this.copyWith({ exists });
  }

  public withFixed(fixed: boolean): this {
    return this.copyWith({ fixed });
  }

  public withColor(color: Color): this {
    return this.copyWith({ color });
  }

  public get isFixed(): boolean {
    return this.fixed;
  }

  public equals(other: TileData): boolean {
    return (
      this.exists === other.exists &&
      this.fixed === other.fixed &&
      this.color === other.color
    );
  }

  public static create(char: string): TileData {
    const exists = char !== '.';
    const fixed = char.toUpperCase() === char;
    const color =
      char.toLowerCase() === 'n'
        ? Color.Gray
        : char.toLowerCase() === 'b'
          ? Color.Dark
          : Color.Light;
    return new TileData(exists, fixed, color);
  }
}
