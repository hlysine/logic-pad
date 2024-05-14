import { memo, useEffect, useMemo, useRef } from 'react';
import { Position } from '../../data/primitives';
import { array } from '../../data/helper';
import { useTheme } from '../ThemeContext';
import GridRawCanvasOverlay, { RawCanvasRef } from './GridRawCanvasOverlay';

export interface ErrorOverlayProps {
  positions: readonly (readonly Position[])[];
  width: number;
  height: number;
}

function positionsToGrid(positions: readonly Position[]) {
  let width = 0;
  let height = 0;
  for (const { x, y } of positions) {
    if (width === 0 || x > width) {
      width = x;
    }
    if (height === 0 || y > height) {
      height = y;
    }
  }
  const grid = array(width + 1, height + 1, () => false);
  for (const { x, y } of positions) {
    grid[y][x] = true;
  }
  return grid;
}

const BLEED = 5;

export default memo(function ErrorOverlay({
  positions,
  width,
  height,
}: ErrorOverlayProps) {
  const canvasRef = useRef<RawCanvasRef>(null);
  const grid = useMemo(
    () => positions.map(list => positionsToGrid(list)),
    [positions]
  );
  const { theme } = useTheme();

  const errorColor = useMemo(
    () =>
      window.getComputedStyle(document.getElementById('color-ref-error')!)
        .color,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [theme]
  );

  useEffect(() => {
    if (canvasRef.current) {
      const { ctx, tileSize } = canvasRef.current;
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

      ctx.strokeStyle = errorColor;
      ctx.lineWidth = 5;
      ctx.lineCap = 'round';

      positions.forEach((list, idx) =>
        list.forEach(({ x, y }) => {
          if (!grid[idx][y - 1]?.[x]) {
            line(x * tileSize, y * tileSize, (x + 1) * tileSize, y * tileSize);
          }
          if (!grid[idx][y][x + 1]) {
            line(
              (x + 1) * tileSize,
              y * tileSize,
              (x + 1) * tileSize,
              (y + 1) * tileSize
            );
          }
          if (!grid[idx][y + 1]?.[x]) {
            line(
              x * tileSize,
              (y + 1) * tileSize,
              (x + 1) * tileSize,
              (y + 1) * tileSize
            );
          }
          if (!grid[idx][y][x - 1]) {
            line(x * tileSize, y * tileSize, x * tileSize, (y + 1) * tileSize);
          }
        })
      );
    }
  }, [positions, grid, errorColor, width, height]);

  return (
    <GridRawCanvasOverlay
      ref={canvasRef}
      width={width}
      height={height}
      bleed={BLEED}
    ></GridRawCanvasOverlay>
  );
});
