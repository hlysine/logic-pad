import Markup from './markups/markup';
import { Color } from './primitives';

type MarkupMap = Map<string, Markup>;

export default class TileData {
  public readonly markups: MarkupMap;
  public constructor(
    public readonly exists: boolean,
    public readonly fixed: boolean,
    public readonly color: Color,
    markups: MarkupMap = new Map()
  ) {
    this.exists = exists;
    this.fixed = fixed;
    this.color = color;
    this.markups = markups;
  }

  public static empty(): TileData {
    return new TileData(true, false, Color.None);
  }

  public copyWith({
    exists,
    fixed,
    color,
    markups,
  }: {
    exists?: boolean;
    fixed?: boolean;
    color?: Color;
    markups?: MarkupMap;
  }): TileData {
    return new TileData(
      exists ?? this.exists,
      fixed ?? this.fixed,
      color ?? this.color,
      markups ?? this.markups
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

  public withMarkups(
    markups: MarkupMap | ((markups: MarkupMap) => MarkupMap)
  ): TileData {
    return this.copyWith({
      markups: markups instanceof Map ? markups : markups(this.markups),
    });
  }

  public addMarkup(markup: Markup): TileData {
    return this.copyWith({
      markups: new Map(this.markups).set(markup.id, markup),
    });
  }

  public removeMarkup(key: string): TileData {
    const markups = new Map(this.markups);
    markups.delete(key);
    return this.copyWith({ markups });
  }

  public get isFixed(): boolean {
    return this.fixed;
  }
}
