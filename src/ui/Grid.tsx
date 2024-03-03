import { useMemo } from 'react';
import GridData from '../data/grid';
import Tile from './Tile';
import MouseContext from './MouseContext';
import { Color } from '../data/tile';

export interface GridProps {
  size: number;
  data: GridData;
  onTileClick?: (x: number, y: number, target: Color) => void;
}

export default function Grid({ size, data, onTileClick }: GridProps) {
  const tileSize = Math.floor(size / Math.max(data.width, data.height));
  const gridStyle = useMemo(
    () => ({
      width: `${size}px`,
      height: `${size}px`,
      gridTemplateColumns: `repeat(${data.width}, ${tileSize}px)`,
      gridTemplateRows: `repeat(${data.height}, ${tileSize}px)`,
    }),
    [size, data.width, data.height, tileSize]
  );
  return (
    <MouseContext>
      <div className="grid" style={gridStyle}>
        {data.tiles.map((row, y) =>
          row.map((tile, x) => (
            <Tile
              key={`${x},${y}`}
              size={tileSize}
              data={tile}
              onTileClick={target => onTileClick?.(x, y, target)}
            />
          ))
        )}
      </div>
    </MouseContext>
  );
}
