import { useMemo } from 'react';
import TileData from '../data/tile';
import { cn } from '../utils';
import { useMouseContext } from './MouseContext';
import { Color } from '../data/primitives';
import TileConnections from '../data/tileConnections';
import Markup from './markups/Markup';

export interface TileProps {
  size: number;
  data: TileData;
  connections: TileConnections;
  onTileClick?: (target: Color) => void;
}

function bg(color: Color) {
  switch (color) {
    case Color.Black:
      return 'bg-black bg-opacity-60 hover:bg-black hover:bg-opacity-60';
    case Color.White:
      return 'bg-white bg-opacity-80 hover:bg-white hover:bg-opacity-80';
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

function useTileParts(size: number, con: TileConnections) {
  return useMemo<React.CSSProperties[]>(() => {
    const parts: React.CSSProperties[] = [];
    for (let y = -1; y <= 1; y++) {
      for (let x = -1; x <= 1; x++) {
        if (x === 0 && y === 0) {
          parts.push({
            width: `${(size * 18) / 20}px`,
            height: `${(size * 18) / 20}px`,
            margin: `${size / 20}px`,
            borderTopLeftRadius: con.top || con.left ? 0 : `${size / 8}px`,
            borderTopRightRadius: con.top || con.right ? 0 : `${size / 8}px`,
            borderBottomLeftRadius:
              con.bottom || con.left ? 0 : `${size / 8}px`,
            borderBottomRightRadius:
              con.bottom || con.right ? 0 : `${size / 8}px`,
          });
        } else if (con[x][y]) {
          parts.push({
            width: x === 0 ? `${(size * 18) / 20}px` : `${size / 20}px`,
            height: y === 0 ? `${(size * 18) / 20}px` : `${size / 20}px`,
            top: y === -1 ? 0 : y === 0 ? `${size / 20}px` : undefined,
            bottom: y === 1 ? 0 : undefined,
            left: x === -1 ? 0 : x === 0 ? `${size / 20}px` : undefined,
            right: x === 1 ? 0 : undefined,
            margin: 0,
            borderRadius: 0,
          });
        }
      }
    }
    return parts;
  }, [size, con]);
}

export default function Tile({
  size,
  data,
  connections,
  onTileClick,
}: TileProps) {
  const mouse = useMouseContext();
  const partStyles = useTileParts(size, connections);
  const containerStyle = useMemo<React.CSSProperties>(
    () => ({
      width: `${size}px`,
      height: `${size}px`,
    }),
    [size]
  );
  const cornerStyle = useMemo<React.CSSProperties>(
    () => ({
      margin: `${size / 20}px`,
    }),
    [size]
  );
  return (
    <div className="relative" style={containerStyle}>
      {data.exists && (
        <>
          {partStyles.map((style, i) => (
            <button
              key={i}
              className={cn(
                'absolute btn p-0 shadow-none min-h-0 border-0 z-0',
                bg(data.color)
              )}
              style={style}
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
            ></button>
          ))}
          {data.fixed && !connections.top && !connections.left && (
            <div
              className={cn(
                'absolute w-2 h-2 border-l-2 border-t-2 border-green-600 pointer-events-none'
              )}
              style={cornerStyle}
            ></div>
          )}
          {data.fixed && !connections.top && !connections.right && (
            <div
              className={cn(
                'absolute w-2 h-2 border-r-2 border-t-2 right-0 border-green-600 pointer-events-none'
              )}
              style={cornerStyle}
            ></div>
          )}
          {data.fixed && !connections.bottom && !connections.left && (
            <div
              className={cn(
                'absolute w-2 h-2 border-l-2 border-b-2 bottom-0 border-green-600 pointer-events-none'
              )}
              style={cornerStyle}
            ></div>
          )}
          {data.fixed && !connections.bottom && !connections.right && (
            <div
              className={cn(
                'absolute w-2 h-2 border-r-2 border-b-2 bottom-0 right-0 border-green-600 pointer-events-none'
              )}
              style={cornerStyle}
            ></div>
          )}
          {[...data.markups.values()].map(m => (
            <Markup
              key={m.id}
              size={size}
              markup={m}
              textClass={fg(data.color)}
            />
          ))}
        </>
      )}
    </div>
  );
}
