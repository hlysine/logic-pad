import { memo, useMemo } from 'react';
import GridData from '../../data/grid';
import Tile from './Tile';
import MouseContext from './MouseContext';
import { Color } from '../../data/primitives';
import { array } from '../../data/helper';

export interface GridProps {
  size: number;
  grid: GridData;
  editable: boolean;
  onTileClick?: (x: number, y: number, target: Color, flood: boolean) => void;
  children?: React.ReactNode;
}

export default memo(function Grid({
  size,
  grid,
  editable,
  onTileClick,
  children,
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
  const clickHandlers = useMemo(
    () =>
      array(
        grid.width,
        grid.height,
        (x, y) => (target: Color, flood: boolean) =>
          onTileClick?.(x, y, target, flood)
      ),
    [grid.width, grid.height, onTileClick]
  );
  return (
    <MouseContext>
      <div className="relative" style={containerStyle}>
        <div
          className="grid justify-center content-center absolute inset-0"
          style={gridStyle}
        >
          {grid.tiles.map((row, y) =>
            row.map((tile, x) => (
              <Tile
                key={`${x},${y}`}
                data={tile}
                editable={editable}
                connections={tileConnections[y][x]}
                onTileClick={clickHandlers[y][x]}
              />
            ))
          )}
        </div>
        {children}
      </div>
    </MouseContext>
  );
});
