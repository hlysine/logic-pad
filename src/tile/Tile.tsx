import { useMemo } from 'react';
import TileData, { Color } from '../data/tile';
import { cn } from '../utils';

export interface TileProps {
  size: number;
  data: TileData;
}

function bg(color: Color) {
  switch (color) {
    case Color.Black:
      return 'bg-black hover:bg-gray-900';
    case Color.White:
      return 'bg-white hover:bg-gray-100';
    case Color.None:
      return 'bg-gray-600 hover:bg-gray-600';
  }
}

function fg(color: Color) {
  switch (color) {
    case Color.Black:
      return 'text-white';
    case Color.White:
      return 'text-black';
    case Color.None:
      return 'text-gray-900';
  }
}

export default function Tile({ size, data }: TileProps) {
  const tileStyle = useMemo(
    () => ({
      width: `${size}px`,
      height: `${size}px`,
      margin: `${size / 20}px`,
    }),
    [size]
  );
  const textStyle = useMemo(
    () => ({
      fontSize: `${size * 0.75}px`,
    }),
    [size]
  );
  return (
    <div className="relative" style={tileStyle}>
      {data.exists && (
        <button
          className={cn(
            'absolute btn shadow-lg w-full h-full p-0',
            bg(data.color)
          )}
        >
          {data.hasNumber && (
            <span
              className={cn('absolute m-auto', fg(data.color))}
              style={textStyle}
            >
              {data.number}
            </span>
          )}
        </button>
      )}
    </div>
  );
}
