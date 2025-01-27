import { PartPlacement, PartSpec } from './types';
import { memo, useEffect, useMemo, useRef, useState } from 'react';
import CellCountPerZoneRule, {
  instance as cellCountPerZoneInstance,
} from '@logic-pad/core/data/rules/cellCountPerZoneRule';
import { useTheme } from '../../contexts/ThemeContext';
import GridCanvasOverlay, { RawCanvasRef } from '../../grid/GridCanvasOverlay';
import { useGrid } from '../../contexts/GridContext';

export interface CellCountPerZoneOverlayPartProps {
  instruction: CellCountPerZoneRule;
}

const BLEED = 5;

export default memo(function CellCountPerZoneOverlayPart({
  instruction,
}: CellCountPerZoneOverlayPartProps) {
  const { theme } = useTheme();
  const { grid } = useGrid();
  const secondaryColor = useMemo(
    () =>
      window.getComputedStyle(document.getElementById('color-ref-secondary')!)
        .color,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [theme]
  );

  const canvasRef = useRef<RawCanvasRef>(null);
  const [tileSize, setTileSize] = useState(0);

  const width = grid.width;
  const height = grid.height;

  useEffect(() => {
    if (!canvasRef.current) return;
    if (tileSize === 0) return;
    const { ctx } = canvasRef.current;
    ctx.clearRect(
      -BLEED,
      -BLEED,
      width * tileSize + 2 * BLEED,
      height * tileSize + 2 * BLEED
    );

    const line = (x1: number, y1: number, x2: number, y2: number) => {
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    };

    ctx.strokeStyle = secondaryColor;
    ctx.lineWidth = Math.max(4, tileSize * 0.05);
    ctx.lineCap = 'round';

    instruction.edges.forEach(edge => {
      let { x1, y1, x2, y2 } = edge;
      x1 += 0.5;
      y1 += 0.5;
      x2 += 0.5;
      y2 += 0.5;
      const [midX, midY] = [(x1 + x2) / 2, (y1 + y2) / 2];
      const [dx, dy] = [x1 - midX, y1 - midY];
      x1 = midX + dy;
      y1 = midY - dx;
      const [dx2, dy2] = [x2 - midX, y2 - midY];
      x2 = midX + dy2;
      y2 = midY - dx2;
      line(x1 * tileSize, y1 * tileSize, x2 * tileSize, y2 * tileSize);
    });
  }, [instruction.edges, secondaryColor, width, height, tileSize]);

  return (
    <GridCanvasOverlay
      ref={canvasRef}
      width={width}
      height={height}
      bleed={BLEED}
      onResize={size => setTileSize(size)}
    ></GridCanvasOverlay>
  );
});

export const spec: PartSpec = {
  placement: PartPlacement.GridOverlay,
  instructionId: cellCountPerZoneInstance.id,
};
