import { useMemo } from 'react';
import GridData from '../data/grid';
import Tile from './Tile';
import MouseContext from './MouseContext';
import { Color } from '../data/primitives';
import Symbol from './symbols/Symbol';
import { fg } from './helper';
import GridOverlay from './GridOverlay';

export interface GridProps {
  size: number;
  grid: GridData;
  editable: boolean;
  onTileClick?: (x: number, y: number, target: Color) => void;
  children?: React.ReactNode;
}

export default function Grid({
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
  const symbols = useMemo(
    () => Array.from(grid.symbols.values()).flat(),
    [grid.symbols]
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
                size={size}
                data={tile}
                editable={editable}
                connections={grid.connections.getForTile({ x, y })}
                onTileClick={target => onTileClick?.(x, y, target)}
              />
            ))
          )}
        </div>
        <GridOverlay>
          {symbols.map(symbol => (
            <Symbol
              key={`${symbol.id}(${symbol.x},${symbol.y})`}
              size={size}
              textClass={fg(
                grid.getTile(Math.floor(symbol.x), Math.floor(symbol.y)).color
              )}
              symbol={symbol}
            />
          ))}
        </GridOverlay>
        {children}
      </div>
    </MouseContext>
  );
}
