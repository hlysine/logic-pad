import { PartPlacement, PartSpec } from './types';
import { memo, useMemo } from 'react';
import OutlineOverlay from '../../grid/OutlineOverlay';
import { instance as foresightInstance } from '../../../data/rules/foresightRule';
import { useTheme } from '../../ThemeContext';
import { useForesight } from '../../ForesightContext';
import { useGrid } from '../../GridContext';

export default memo(function MusicOverlayPart() {
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
