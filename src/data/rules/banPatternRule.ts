import GridData from '../grid';
import { Color, Errors } from '../primitives';
import TileData from '../tile';
import Rule from './rule';

export type Pattern = readonly (readonly Color[])[];

export default class BanPatternRule extends Rule {
  public readonly pattern: Pattern;

  public constructor(pattern: Pattern | GridData) {
    super();
    this.pattern =
      pattern instanceof GridData
        ? BanPatternRule.gridToPattern(pattern)
        : pattern;
  }

  public get id(): string {
    return `ban_pattern`;
  }

  public get explanation(): string {
    return `Don't make this pattern`;
  }

  public get exampleGrid(): GridData {
    return BanPatternRule.patternToGrid(this.pattern);
  }

  public validateGrid(_grid: GridData): Errors | null {
    throw new Error('Method not implemented.');
  }

  public copyWith({ pattern }: { pattern?: Pattern | GridData }): this {
    return new BanPatternRule(
      (pattern instanceof GridData
        ? BanPatternRule.gridToPattern(pattern)
        : pattern) ?? this.pattern
    ) as this;
  }

  public withPattern(pattern: Pattern): this {
    return this.copyWith({ pattern });
  }

  public static gridToPattern(grid: GridData): Pattern {
    return grid.tiles.map(row =>
      row.map(tile =>
        tile.exists && tile.color !== Color.Gray ? tile.color : Color.Gray
      )
    );
  }

  public static patternToGrid(pattern: Pattern): GridData {
    const tiles = pattern.map(row =>
      row.map(color => new TileData(color !== Color.Gray, false, color))
    );
    return new GridData(pattern[0].length, pattern.length, tiles);
  }
}
