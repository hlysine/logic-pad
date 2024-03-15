import { memo, useMemo } from 'react';
import TileData from '../../data/tile';
import { cn } from '../../utils';
import { useMouseContext } from './MouseContext';
import { Color } from '../../data/primitives';
import TileConnections from '../../data/tileConnections';
import { bg, color } from '../helper';

export interface TileProps {
  size: number;
  data: TileData;
  editable: boolean;
  connections: TileConnections;
  onTileClick?: (target: Color) => void;
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

export default memo(function Tile({
  size,
  data,
  editable,
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
      width: `${size / 8}px`,
      height: `${size / 8}px`,
      borderWidth: `${size / 30}px`,
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
                'absolute btn duration-0 p-0 shadow-none min-h-0 border-0 z-0',
                bg(data.color),
                editable ? 'cursor-pointer' : 'cursor-default'
              )}
              style={style}
              onMouseDown={e => {
                e.preventDefault();
                if (!editable) return;
                let c = color(e.buttons);
                if (!c) {
                  mouse.setColor(null, false);
                } else {
                  if (data.fixed) return;
                  if (c === data.color) c = Color.Gray;
                  mouse.setColor(
                    c,
                    c !== Color.Gray && data.color !== Color.Gray
                  );
                  onTileClick?.(c);
                }
              }}
              onMouseUp={e => {
                e.preventDefault();
                if (!editable) return;
                mouse.setColor(null, false);
              }}
              onMouseEnter={e => {
                e.preventDefault();
                if (!editable) return;
                const c = color(e.buttons);
                if (
                  !c ||
                  !mouse.color ||
                  (c !== mouse.color && mouse.color !== Color.Gray)
                ) {
                  mouse.setColor(null, false);
                } else {
                  if (data.fixed) return;
                  if (mouse.color === data.color) return;
                  if (
                    mouse.color === Color.Gray ||
                    data.color === Color.Gray ||
                    mouse.replacing
                  )
                    onTileClick?.(mouse.color);
                }
              }}
            ></button>
          ))}
          {data.fixed && !connections.top && !connections.left && (
            <div
              className={cn(
                'absolute !border-r-0 !border-b-0 border-green-600 pointer-events-none'
              )}
              style={cornerStyle}
            ></div>
          )}
          {data.fixed && !connections.top && !connections.right && (
            <div
              className={cn(
                'absolute !border-l-0 !border-b-0 right-0 border-green-600 pointer-events-none'
              )}
              style={cornerStyle}
            ></div>
          )}
          {data.fixed && !connections.bottom && !connections.left && (
            <div
              className={cn(
                'absolute !border-r-0 !border-t-0 bottom-0 border-green-600 pointer-events-none'
              )}
              style={cornerStyle}
            ></div>
          )}
          {data.fixed && !connections.bottom && !connections.right && (
            <div
              className={cn(
                'absolute !border-l-0 !border-t-0 bottom-0 right-0 border-green-600 pointer-events-none'
              )}
              style={cornerStyle}
            ></div>
          )}
        </>
      )}
    </div>
  );
});
