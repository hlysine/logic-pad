import { memo, useMemo } from 'react';
import { array } from '../../../data/helper';
import { cn } from '../../../utils';
import { type GridProps } from '../Grid';
import { Layer, Stage } from 'react-konva';
import PointerCaptureOverlay from '../PointerCaptureOverlay';
import { useTheme } from '../../ThemeContext';
import Tile from './Tile';

export default memo(function Grid({
  size,
  grid,
  editable,
  onTileClick,
  children,
  className,
}: GridProps) {
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

  const whiteColor = useMemo(
    () =>
      window.getComputedStyle(document.getElementById('color-ref-white')!)
        .color,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [theme]
  );
  const blackColor = useMemo(
    () =>
      window.getComputedStyle(document.getElementById('color-ref-black')!)
        .color,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [theme]
  );
  const neutralColor = useMemo(
    () =>
      window.getComputedStyle(
        document.getElementById('color-ref-neutral-content')!
      ).color,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [theme]
  );

  return (
    <div className={cn('relative', className)} style={containerStyle}>
      <Stage
        width={grid.width * size}
        height={grid.height * size}
        className="absolute"
      >
        <Layer>
          {grid.tiles.map((row, y) =>
            row.map((tile, x) => (
              <Tile
                key={`${x},${y}`}
                data={tile}
                x={x}
                y={y}
                size={size}
                connections={tileConnections[y][x]}
                blackColor={blackColor}
                whiteColor={whiteColor}
                neutralColor={neutralColor}
              />
            ))
          )}
        </Layer>
      </Stage>
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
