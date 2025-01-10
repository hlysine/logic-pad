import { Position } from '../../../primitives.js';
import RegionShapeRule, {
  ShapeRegions,
} from '../../../rules/regionShapeRule.js';
import {
  normalizeShape,
  positionsToShape,
  shapeEquals,
} from '../../../shapes.js';
import BTModule, {
  BTGridData,
  BTTile,
  IntArray2D,
  colorToBTTile,
} from '../data.js';

export default abstract class RegionShapeBTModule extends BTModule {
  public instr: RegionShapeRule;

  public constructor(instr: RegionShapeRule) {
    super();
    this.instr = instr;
  }

  protected getShapeRegions(grid: BTGridData): ShapeRegions['regions'] {
    // TODO: This is extremely slow, because it doesn't check shapes when shapes are not fully enclosed

    const visited = IntArray2D.create(grid.width, grid.height);

    const regions: ShapeRegions['regions'] = [];

    for (let y = 0; y < grid.height; y++) {
      for (let x = 0; x < grid.width; x++) {
        const tile = grid.getTile(x, y);
        if (tile !== colorToBTTile(this.instr.color) || visited.get(x, y))
          continue;

        const positions = this.visitArea(grid, tile, visited, { x, y });
        if (!positions) continue;

        const shape = normalizeShape(
          positionsToShape(positions, this.instr.color)
        );
        const existing = regions.find(island =>
          shapeEquals(island.shape, shape)
        );
        if (existing) {
          existing.count++;
        } else {
          regions.push({ positions, shape, count: 1 });
        }
      }
    }

    return regions;
  }

  private visitArea(
    grid: BTGridData,
    tile: BTTile,
    visited: IntArray2D,
    pos: Position
  ): Position[] | null {
    const positions: Position[] = [pos];

    const sameTileQueue: Position[] = [pos];

    let incomplete = false;

    visited.set(pos.x, pos.y, 1);

    // Count same tile
    while (sameTileQueue.length > 0) {
      const curPos = sameTileQueue.pop()!;

      for (const edge of grid.getEdges(curPos)) {
        if (visited.get(edge.x, edge.y)) continue;

        const edgeTile = grid.getTile(edge.x, edge.y);

        if (edgeTile === BTTile.Empty) {
          incomplete = true;
        } else if (edgeTile === tile) {
          positions.push(edge);
          sameTileQueue.push(edge);
          visited.set(edge.x, edge.y, 1);
        }
      }
    }

    return incomplete ? null : positions;
  }
}
