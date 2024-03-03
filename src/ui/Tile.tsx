import { useMemo } from 'react';
import TileData, { Color } from '../data/tile';
import { cn } from '../utils';
import { useMouseContext } from './MouseContext';

export interface TileProps {
  size: number;
  data: TileData;
  onTileClick?: (target: Color) => void;
}

function bg(color: Color) {
  switch (color) {
    case Color.Black:
      return 'bg-black hover:bg-gray-900';
    case Color.White:
      return 'bg-white hover:bg-gray-100';
    case Color.None:
      return 'bg-gray-600 bg-opacity-50 hover:bg-gray-600 hover:bg-opacity-50';
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

function color(buttons: number) {
  switch (buttons) {
    case 1:
      return Color.Black;
    case 2:
      return Color.White;
    default:
      return undefined;
  }
}

export default function Tile({ size, data, onTileClick }: TileProps) {
  const mouse = useMouseContext();
  const tileStyle = useMemo(
    () => ({
      width: `${(size * 18) / 20}px`,
      height: `${(size * 18) / 20}px`,
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
          onMouseDown={e => {
            e.preventDefault();
            let c = color(e.buttons);
            if (!c) {
              mouse.setColor(null);
            } else {
              if (data.fixed) return;
              if (c === data.color) c = Color.None;
              mouse.setColor(c);
              onTileClick?.(c);
            }
          }}
          onMouseUp={e => {
            e.preventDefault();
            mouse.setColor(null);
          }}
          onMouseEnter={e => {
            e.preventDefault();
            const c = color(e.buttons);
            if (
              !c ||
              !mouse.color ||
              (c !== mouse.color && mouse.color !== Color.None)
            ) {
              mouse.setColor(null);
            } else {
              if (data.fixed) return;
              if (mouse.color === data.color) return;
              onTileClick?.(mouse.color);
            }
          }}
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
