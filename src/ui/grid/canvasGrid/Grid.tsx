import { memo, useEffect, useMemo, useRef } from 'react';
import { array } from '../../../data/helper';
import { cn } from '../../../utils';
import { type GridProps } from '../Grid';
import PointerCaptureOverlay from '../PointerCaptureOverlay';
import { useTheme } from '../../ThemeContext';
import { ColorInfo, clearTile, renderTile } from './tile';
import GridData from '../../../data/grid';
import TileConnections from '../../../data/tileConnections';

interface GridRenderData {
  grid: GridData;
  connections: TileConnections[][];
  size: number;
}

export default memo(function Grid({
  size,
  grid,
  editable,
  onTileClick,
  children,
  className,
}: GridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasCtx = useRef<CanvasRenderingContext2D | null>(null);
  const prevData = useRef<GridRenderData | null>(null);
  const { theme } = useTheme();
  const containerStyle = useMemo(
    () => ({
      width: `${size * grid.width}px`,
      height: `${size * grid.height}px`,
      minWidth: `${size * grid.width}px`,
      minHeight: `${size * grid.height}px`,
      fontSize: `${size}px`,
    }),
    [size, grid.width, grid.height]
  );
  const tileConnections = useMemo(
    () =>
      array(grid.width, grid.height, (x, y) =>
        grid.connections.getForTile({ x, y })
      ),
    [grid.connections, grid.width, grid.height]
  );

  const colorInfo = useMemo<ColorInfo>(
    () => ({
      black: window.getComputedStyle(
        document.getElementById('color-ref-black')!
      ).color,
      white: window.getComputedStyle(
        document.getElementById('color-ref-white')!
      ).color,
      neutral: window.getComputedStyle(
        document.getElementById('color-ref-neutral-content')!
      ).color,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [theme]
  );

  useEffect(() => {
    if (!canvasCtx.current) {
      canvasCtx.current = canvasRef.current?.getContext('2d') ?? null;
    }
    if (!canvasCtx.current) return;
    const ctx = canvasCtx.current;
    for (let y = 0; y < grid.height; y++) {
      for (let x = 0; x < grid.width; x++) {
        const tile = grid.getTile(x, y);
        const oldTile = prevData.current?.grid.getTile(x, y);
        if (
          prevData.current?.size === size &&
          oldTile?.equals(tile) &&
          prevData.current?.connections[y]?.[x].equals(tileConnections[y][x])
        )
          continue;
        clearTile(ctx, x, y, size);
        if (!tile.exists) continue;
        renderTile(ctx, x, y, size, tile, tileConnections[y][x], colorInfo);
      }
    }
    prevData.current = { grid, connections: tileConnections, size };
  }, [grid, size, canvasCtx, colorInfo, tileConnections]);

  return (
    <div className={cn('relative', className)} style={containerStyle}>
      <canvas
        ref={canvasRef}
        width={grid.width * size}
        height={grid.height * size}
        className="absolute inset-0"
      />
      <PointerCaptureOverlay
        width={grid.width}
        height={grid.height}
        colorMap={(x, y, color) => grid.getTile(x, y).color === color}
        onTileClick={(x, y, _from, to, flood) => {
          if (editable && grid.getTile(x, y).exists)
            onTileClick?.(x, y, to, flood);
        }}
        allowDrag={true}
        allowReplace={true}
        step={1}
      />
      {children}
    </div>
  );
});
