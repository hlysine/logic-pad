import { memo } from 'react';
import { useToolbox } from '../contexts/ToolboxContext.tsx';

export default memo(function ToolboxOverlay() {
  const { gridOverlay } = useToolbox();
  return gridOverlay;
});
