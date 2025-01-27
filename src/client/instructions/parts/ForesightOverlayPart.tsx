import { PartPlacement, PartSpec } from './types';
import { memo, useMemo } from 'react';
import OutlineOverlay from '../../grid/OutlineOverlay';
import { instance as foresightInstance } from '@logic-pad/core/data/rules/foresightRule';
import { useTheme } from '../../contexts/ThemeContext.tsx';
import { useForesight } from '../../contexts/ForesightContext.tsx';
import { useGrid } from '../../contexts/GridContext.tsx';

export default memo(function ForesightOverlayPart() {
  const { theme } = useTheme();
  const { grid } = useGrid();
  const { position } = useForesight();
  const accentColor = useMemo(
    () =>
      window.getComputedStyle(document.getElementById('color-ref-accent')!)
        .color,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [theme]
  );

  const positions = useMemo(() => (position ? [[position]] : null), [position]);

  if (positions === null) return null;
  return (
    <OutlineOverlay
      positions={positions}
      width={grid.width}
      height={grid.height}
      color={accentColor}
    ></OutlineOverlay>
  );
});

export const spec: PartSpec = {
  placement: PartPlacement.GridOverlay,
  instructionId: foresightInstance.id,
};
