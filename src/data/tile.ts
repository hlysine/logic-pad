import { Color } from './primitives';
import Symbol from './rules/symbol';

type SymbolMap = Map<string, Symbol>;

export default class TileData {
  public readonly symbols: SymbolMap;
  public constructor(
    public readonly exists: boolean,
    public readonly fixed: boolean,
    public readonly color: Color,
    symbols: SymbolMap = new Map()
  ) {
    this.exists = exists;
    this.fixed = fixed;
    this.color = color;
    this.symbols = symbols;
  }

  public static empty(): TileData {
    return new TileData(true, false, Color.None);
  }

  public copyWith({
    exists,
    fixed,
    color,
    symbols,
  }: {
    exists?: boolean;
    fixed?: boolean;
    color?: Color;
    symbols?: SymbolMap;
  }): TileData {
    return new TileData(
      exists ?? this.exists,
      fixed ?? this.fixed,
      color ?? this.color,
      symbols ?? this.symbols
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

  public withSymbols(
    symbols: SymbolMap | ((symbols: SymbolMap) => SymbolMap)
  ): TileData {
    return this.copyWith({
      symbols: symbols instanceof Map ? symbols : symbols(this.symbols),
    });
  }

  public addSymbol(symbol: Symbol): TileData {
    return this.copyWith({
      symbols: new Map(this.symbols).set(symbol.id, symbol),
    });
  }

  public removeSymbol(key: string): TileData {
    const symbols = new Map(this.symbols);
    symbols.delete(key);
    return this.copyWith({ symbols });
  }

  public get isFixed(): boolean {
    return this.fixed;
  }
}
