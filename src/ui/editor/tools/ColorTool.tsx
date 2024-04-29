import { memo } from 'react';
import ToolboxItem from '../ToolboxItem';
import { Color } from '../../../data/primitives';
import { RiCheckboxMultipleBlankFill } from 'react-icons/ri';

export default memo(function ColorTool() {
  return (
    <ToolboxItem
      id="color"
      name="Edit color"
      description="Left/right click to change tile color. Given tiles can also be changed."
      gridOverlay={null}
      onTileClick={(x, y, target, flood, { grid, setGrid }) => {
        const tile = grid.getTile(x, y);
        if (flood && target === Color.Gray) {
          // target is Color.Gray if the tile is already the target color
          setGrid(grid.floodFillAll(Color.Gray, tile.color));
        } else if (flood) {
          setGrid(grid.floodFill({ x, y }, tile.color, target));
        } else {
          setGrid(grid.setTile(x, y, t => t.withColor(target)));
        }
      }}
    >
      <RiCheckboxMultipleBlankFill />
    </ToolboxItem>
  );
});
