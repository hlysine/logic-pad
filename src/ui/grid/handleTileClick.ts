import { Color } from '../../data/primitives';
import { GridContext } from '../GridContext';

export default function handleTileClick(
  x: number,
  y: number,
  target: Color,
  flood: boolean,
  { grid, setGrid }: GridContext,
  overrideFixedTiles: boolean
) {
  if (overrideFixedTiles) {
    const tile = grid.getTile(x, y);
    if (flood && target === Color.Gray) {
      // target is Color.Gray if the tile is already the target color
      setGrid(grid.floodFillAll(Color.Gray, tile.color));
    } else if (flood) {
      setGrid(grid.floodFill({ x, y }, tile.color, target));
    } else {
      setGrid(grid.setTile(x, y, t => t.withColor(target)));
    }
  } else {
    const tile = grid.getTile(x, y);
    if (flood && target === Color.Gray) {
      // target is Color.Gray if the tile is already the target color
      setGrid(grid.floodFillAll(Color.Gray, tile.color));
    } else if (flood && !tile.fixed) {
      setGrid(grid.floodFill({ x, y }, Color.Gray, target));
    } else if (!tile.fixed) {
      setGrid(grid.setTile(x, y, t => t.withColor(target)));
    }
  }
}
