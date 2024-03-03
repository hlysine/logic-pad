import TileData from './tile';

export default class GridData {
  public readonly tiles: readonly (readonly TileData[])[];

  public constructor(
    public readonly width: number,
    public readonly height: number,
    tiles?: readonly (readonly TileData[])[]
  ) {
    this.width = width;
    this.height = height;
    this.tiles =
      tiles ??
      Array.from({ length: height }, () =>
        Array.from({ length: width }, () => TileData.empty())
      );
  }

  public getTile(x: number, y: number): TileData {
    return this.tiles[y][x];
  }

  public setTile(x: number, y: number, tile: TileData): GridData;
  public setTile(
    x: number,
    y: number,
    transform: (tile: TileData) => TileData
  ): GridData;

  public setTile(
    x: number,
    y: number,
    tile: TileData | ((tile: TileData) => TileData)
  ): GridData {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
      return this;
    }
    const newTiles = this.tiles.map((row, j) =>
      j === y
        ? row.map((t, i) =>
            i === x ? (typeof tile === 'function' ? tile(t) : tile) : t
          )
        : row
    );
    return new GridData(this.width, this.height, newTiles);
  }

  public resize(width: number, height: number): GridData {
    const newGrid = new GridData(width, height);
    for (let y = 0; y < Math.min(this.height, height); y++) {
      for (let x = 0; x < Math.min(this.width, width); x++) {
        newGrid.setTile(x, y, this.getTile(x, y));
      }
    }
    return newGrid;
  }
}
