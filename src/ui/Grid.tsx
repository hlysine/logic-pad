import { useMemo } from 'react';
import GridData from '../data/grid';
import Tile from './Tile';
import MouseContext from './MouseContext';
import { Color } from '../data/primitives';
import Symbol from './symbols/Symbol';
import { fg } from './helper';

export interface GridProps {
  size: number;
  data: GridData;
  onTileClick?: (x: number, y: number, target: Color) => void;
}

export default function Grid({ size, data, onTileClick }: GridProps) {
  const tileSize = Math.floor(size / Math.max(data.width, data.height));
  const containerStyle = useMemo(
    () => ({
      width: `${size}px`,
      height: `${size}px`,
    }),
    [size]
  );
  const gridStyle = useMemo(
    () => ({
      gridTemplateColumns: `repeat(${data.width}, ${tileSize}px)`,
      gridTemplateRows: `repeat(${data.height}, ${tileSize}px)`,
    }),
    [data.width, data.height, tileSize]
  );
  return (
    <MouseContext>
      <div className="relative" style={containerStyle}>
        <div className="grid absolute inset-0" style={gridStyle}>
          {data.tiles.map((row, y) =>
            row.map((tile, x) => (
              <Tile
                key={`${x},${y}`}
                size={tileSize}
                data={tile}
                connections={data.connections.getForTile({ x, y })}
                onTileClick={target => onTileClick?.(x, y, target)}
              />
            ))
          )}
        </div>
        <div className="absolute inset-0">
          {data.symbols.map(symbol => (
            <Symbol
              key={`${symbol.id}(${symbol.x},${symbol.y})`}
              size={tileSize}
              textClass={fg(
                data.getTile(Math.floor(symbol.x), Math.floor(symbol.y)).color
              )}
              symbol={symbol}
            />
          ))}
        </div>
      </div>
    </MouseContext>
  );
}
