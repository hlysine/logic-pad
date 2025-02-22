import { memo, useMemo } from 'react';
import Tile from './Tile';
import { array } from '@logic-pad/core/data/dataHelper';
import { cn } from '../../../client/uiHelper.ts';
import { type GridProps } from '../Grid';
import PointerCaptureOverlay from '../PointerCaptureOverlay.tsx';

export default memo(function Grid({
  size,
  grid,
  editable,
  onTileClick,
  bleed,
  children,
  className,
}: GridProps) {
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
  const gridStyle = useMemo(
    () => ({
      gridTemplateColumns: `repeat(${grid.width}, ${size}px)`,
      gridTemplateRows: `repeat(${grid.height}, ${size}px)`,
    }),
    [grid.width, grid.height, size]
  );
  const tileConnections = useMemo(
    () =>
      array(grid.width, grid.height, (x, y) =>
        grid.connections.getForTile({ x, y })
      ),
    [grid.connections, grid.width, grid.height]
  );
  return (
    <div className={cn('relative', className)} style={containerStyle}>
      <div
        className="grid justify-center content-center absolute inset-0"
        style={gridStyle}
      >
        {grid.tiles.map((row, y) =>
          row.map((tile, x) => (
            <Tile
              key={`${x},${y}`}
              data={tile}
              editable={false}
              connections={tileConnections[y][x]}
            />
          ))
        )}
      </div>
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
        bleed={bleed}
      />
      {children}
    </div>
  );
});
