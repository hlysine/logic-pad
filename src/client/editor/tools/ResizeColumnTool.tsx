import { memo } from 'react';
import ToolboxItem from '../ToolboxItem';
import { ResizeToolOverlay } from './ResizeRowTool';
import { TbColumnInsertRight } from 'react-icons/tb';

export default memo(function ResizeColumnTool() {
  return (
    <ToolboxItem
      id="resize_col"
      order={4}
      name="Resize column"
      description="Click between tiles to insert. Click on tiles to remove."
      hotkey="f"
      gridOverlay={<ResizeToolOverlay direction="column" />}
      onTileClick={null}
    >
      <TbColumnInsertRight />
    </ToolboxItem>
  );
});
