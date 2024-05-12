import Instruction from '../../instruction';
import { Color, Position } from '../../primitives';

export enum BTTile {
  Empty,
  Dark,
  Light,
  NonExist,
}

export type BTColor = BTTile.Dark | BTTile.Light;

export class BTGridData {
  public constructor(
    public readonly tiles: BTTile[][],
    public readonly connections: Position[][][],
    public readonly modules: BTModule[],
    public readonly width: number,
    public readonly height: number
  ) {
    this.tiles = tiles;
    this.connections = connections;
    this.modules = modules;
    this.width = width;
    this.height = height;
  }

  public getTile(x: number, y: number): BTTile {
    return this.tiles[y][x];
  }

  public setTileWithConnection(x: number, y: number, tile: BTTile) {
    for (const pos of this.connections[y][x]) {
      this.tiles[pos.y][pos.x] = tile;
    }
  }

  public isInBound(x: number, y: number) {
    return x >= 0 && x < this.width && y >= 0 && y < this.height;
  }

  public getEdges(pos: Position): Position[] {
    const positions: Position[] = [];

    if (pos.x > 0) {
      if (this.getTile(pos.x - 1, pos.y) !== BTTile.NonExist)
        positions.push({ x: pos.x - 1, y: pos.y });
    }
    if (pos.x + 1 < this.width) {
      if (this.getTile(pos.x + 1, pos.y) !== BTTile.NonExist)
        positions.push({ x: pos.x + 1, y: pos.y });
    }
    if (pos.y > 0) {
      if (this.getTile(pos.x, pos.y - 1) !== BTTile.NonExist)
        positions.push({ x: pos.x, y: pos.y - 1 });
    }
    if (pos.y + 1 < this.height) {
      if (this.getTile(pos.x, pos.y + 1) !== BTTile.NonExist)
        positions.push({ x: pos.x, y: pos.y + 1 });
    }

    return positions;
  }

  public clone(): BTGridData {
    return new BTGridData(
      this.tiles.map(arr => [...arr]),
      this.connections,
      this.modules,
      this.width,
      this.height
    );
  }
}

export class IntArray2D {
  private constructor(
    private readonly array: Uint8Array,
    public readonly width: number,
    public readonly height: number
  ) {
    this.array = array;
    this.width = width;
    this.height = height;
  }

  public static create(width: number, height: number): IntArray2D {
    return new IntArray2D(new Uint8Array(width * height), width, height);
  }

  public set(x: number, y: number, value: number) {
    this.array[y * this.width + x] = value;
  }

  public get(x: number, y: number): number {
    return this.array[y * this.width + x];
  }

  public clone(): IntArray2D {
    return new IntArray2D(new Uint8Array(this.array), this.width, this.height);
  }
}

export interface CheckResult {
  tilesNeedCheck: IntArray2D | null;
  ratings: Rating[] | null;
}

export interface Rating {
  pos: Position;
  score: number;
}

export default abstract class BTModule {
  abstract instr: Instruction;

  public abstract checkGlobal(grid: BTGridData): CheckResult | false;

  public abstract checkLocal(
    grid: BTGridData,
    positions: Position[]
  ): CheckResult | boolean;
}

export function getOppositeColor(color: BTColor): BTColor {
  return color === BTTile.Dark ? BTTile.Light : BTTile.Dark;
}

export function colorToBTTile(color: Color): BTTile {
  if (color === Color.Gray) return BTTile.Empty;
  else if (color === Color.Light) return BTTile.Light;
  else return BTTile.Dark;
}

export function createOneTileResult(
  grid: BTGridData,
  pos: Position,
  score: number | undefined = 1
): CheckResult {
  const tilesNeedCheck = IntArray2D.create(grid.width, grid.height);
  tilesNeedCheck.set(pos.x, pos.y, 1);

  const ratings: Rating[] = [{ pos, score }];

  return { tilesNeedCheck, ratings };
}
