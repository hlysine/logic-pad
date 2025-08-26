import { memo } from 'react';
import ToolboxItem from '../ToolboxItem';
import { RiCheckboxMultipleBlankFill } from 'react-icons/ri';
import handleTileClick from '../../grid/handleTileClick';

export default memo(function ColorTool() {
  return (
    <ToolboxItem
      id="color"
      order={1}
      name="Edit color"
      description="Left/right click to change tile color. Given tiles can also be changed."
      hotkey="a"
      gridOverlay={null}
      defaultSelected
      onTileClick={(x, y, target, flood, gridContext) => {
        handleTileClick(x, y, target, flood, gridContext, true);
      }}
    >
      <RiCheckboxMultipleBlankFill />
    </ToolboxItem>
  );
});
