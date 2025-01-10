import GridData from '../grid.js';
import { array } from '../dataHelper.js';
import { Color, Position } from '../primitives.js';
import {
  Shape,
  normalizeShape,
  positionsToShape,
  shapeEquals,
} from '../shapes.js';
import Rule from './rule.js';

export type ShapeRegions = {
  regions: {
    positions: Position[];
    shape: Shape;
    count: number;
  }[];
  complete: boolean;
};

export default abstract class RegionShapeRule extends Rule {
  /**
   * @param color - The color of the regions to compare.
   */
  public constructor(public readonly color: Color) {
    super();
    this.color = color;
  }

  protected getShapeRegions(grid: GridData): ShapeRegions {
    let complete = true;
    const visited = array(grid.width, grid.height, (i, j) => {
      const tile = grid.getTile(i, j);
      if (tile.exists && tile.color === Color.Gray) complete = false;
      return !(tile.exists && tile.color === this.color);
    });
    const regions: ShapeRegions['regions'] = [];
    while (true) {
      const seed = grid.find((_tile, x, y) => !visited[y][x]);
      if (!seed) break;
      const positions: Position[] = [];
      grid.iterateArea(
        seed,
        tile => tile.color === this.color,
        (_, x, y) => {
          visited[y][x] = true;
          positions.push({ x, y });
        }
      );
      const incomplete = grid.iterateArea(
        seed,
        tile => tile.color === this.color || tile.color === Color.Gray,
        tile => {
          if (tile.color === Color.Gray) return true;
        }
      );
      if (incomplete) continue;
      const shape = normalizeShape(positionsToShape(positions, this.color));
      const existing = regions.find(island => shapeEquals(island.shape, shape));
      if (existing) {
        existing.count++;
      } else {
        regions.push({ positions, shape, count: 1 });
      }
    }
    return { regions, complete };
  }

  public withColor(color: Color): this {
    return this.copyWith({ color });
  }
}

export const instance = undefined;
