import { memo } from 'react';
import { useToolbox } from '../ToolboxContext';

export default memo(function ToolboxOverlay() {
  const { gridOverlay } = useToolbox();
  return gridOverlay;
});
