import { memo, useMemo } from 'react';
import TileData from '../../data/tile';
import { cn } from '../../utils';
import { useMouseContext } from './MouseContext';
import { Color } from '../../data/primitives';
import TileConnections from '../../data/tileConnections';
import { bg, color } from '../helper';

export interface TileProps {
  data: TileData;
  editable: boolean;
  connections: TileConnections;
  onTileClick?: (target: Color, flood: boolean) => void;
}

function useTileParts(con: TileConnections) {
  return useMemo<React.CSSProperties[]>(() => {
    const parts: React.CSSProperties[] = [];
    for (let y = -1; y <= 1; y++) {
      for (let x = -1; x <= 1; x++) {
        if (x === 0 && y === 0) {
          parts.push({
            fontSize: `1em`,
            width: `0.9em`,
            height: `0.9em`,
            margin: `0.05em`,
            borderTopLeftRadius: con.top || con.left ? 0 : `0.125em`,
            borderTopRightRadius: con.top || con.right ? 0 : `0.125em`,
            borderBottomLeftRadius: con.bottom || con.left ? 0 : `0.125em`,
            borderBottomRightRadius: con.bottom || con.right ? 0 : `0.125em`,
          });
        } else if (con[x][y]) {
          parts.push({
            fontSize: `1em`,
            width: x === 0 ? `0.9em` : `0.05em`,
            height: y === 0 ? `0.9em` : `0.05em`,
            top: y === -1 ? 0 : y === 0 ? `0.05em` : undefined,
            bottom: y === 1 ? 0 : undefined,
            left: x === -1 ? 0 : x === 0 ? `0.05em` : undefined,
            right: x === 1 ? 0 : undefined,
            margin: 0,
            borderRadius: 0,
          });
        }
      }
    }
    return parts;
  }, [con]);
}

export default memo(function Tile({
  data,
  editable,
  connections,
  onTileClick,
}: TileProps) {
  const mouse = useMouseContext();
  const partStyles = useTileParts(connections);
  return (
    <div className="relative w-[1em] h-[1em]">
      {data.exists && (
        <>
          {partStyles.map((style, i) => (
            <button
              key={i}
              className={cn(
                'absolute btn no-animation transition-none duration-0 p-0 shadow-none min-h-0 border-0 z-0',
                bg(data.color),
                editable ? 'cursor-pointer' : 'cursor-default'
              )}
              tabIndex={
                editable && style.borderTopLeftRadius !== undefined ? 0 : -1 // dirty hack to make only the central button focusable
              }
              style={style}
              onMouseDown={e => {
                e.preventDefault();
                if (!editable) return;
                let c = color(e.buttons);
                if (!c) {
                  mouse.setColor(null, false);
                } else {
                  if (c === data.color) c = Color.Gray;
                  mouse.setColor(
                    c,
                    c !== Color.Gray && data.color !== Color.Gray
                  );
                  onTileClick?.(c, e.ctrlKey);
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
                  if (mouse.color === data.color) return;
                  if (
                    mouse.color === Color.Gray ||
                    data.color === Color.Gray ||
                    mouse.replacing
                  )
                    onTileClick?.(mouse.color, e.ctrlKey);
                }
              }}
            ></button>
          ))}
          {data.fixed && !connections.top && !connections.left && (
            <div
              className={cn(
                'absolute !border-r-0 !border-b-0 border-green-600 pointer-events-none w-[0.167em] h-[0.167em] border-[0.05em] m-[0.05em]'
              )}
            ></div>
          )}
          {data.fixed && !connections.top && !connections.right && (
            <div
              className={cn(
                'absolute !border-l-0 !border-b-0 right-0 border-green-600 pointer-events-none w-[0.167em] h-[0.167em] border-[0.05em] m-[0.05em]'
              )}
            ></div>
          )}
          {data.fixed && !connections.bottom && !connections.left && (
            <div
              className={cn(
                'absolute !border-r-0 !border-t-0 bottom-0 border-green-600 pointer-events-none w-[0.167em] h-[0.167em] border-[0.05em] m-[0.05em]'
              )}
            ></div>
          )}
          {data.fixed && !connections.bottom && !connections.right && (
            <div
              className={cn(
                'absolute !border-l-0 !border-t-0 bottom-0 right-0 border-green-600 pointer-events-none w-[0.167em] h-[0.167em] border-[0.05em] m-[0.05em]'
              )}
            ></div>
          )}
        </>
      )}
    </div>
  );
});
