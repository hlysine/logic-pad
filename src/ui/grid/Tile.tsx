import { memo, useMemo } from 'react';
import TileData from '../../data/tile';
import { cn } from '../../utils';
import mouseContext from './MouseContext';
import { Color } from '../../data/primitives';
import TileConnections from '../../data/tileConnections';
import { bg } from '../helper';
import './tile.css';

export interface TileProps {
  data: TileData;
  editable: boolean;
  connections: TileConnections;
  onTileClick?: (target: Color, flood: boolean) => void;
}

const TR = 1;
const TL = 1 << 1;
const BR = 1 << 2;
const BL = 1 << 3;

interface TilePartSpec {
  t: 0 | 1 | 2;
  r: 0 | 1 | 2;
  b: 0 | 1 | 2;
  l: 0 | 1 | 2;
  corners: number;
}

const tileShapes = Object.freeze(
  new Map<string, TilePartSpec[]>([
    ['000010000', [{ t: 1, r: 1, b: 1, l: 1, corners: TR | TL | BR | BL }]], // center only
    ['010010000', [{ t: 0, r: 1, b: 1, l: 1, corners: BR | BL }]], // center + top
    ['000010010', [{ t: 1, r: 1, b: 0, l: 1, corners: TR | TL }]], // center + bottom
    ['000110000', [{ t: 1, r: 1, b: 1, l: 0, corners: TR | BR }]], // center + left
    ['000011000', [{ t: 1, r: 0, b: 1, l: 1, corners: TL | BL }]], // center + right
    ['010010010', [{ t: 0, r: 1, b: 0, l: 1, corners: 0 }]], // center + top + bottom
    ['000111000', [{ t: 1, r: 0, b: 1, l: 0, corners: 0 }]], // center + left + right
    [
      '010110000',
      [
        { t: 0, r: 1, b: 1, l: 1, corners: BR },
        { t: 1, r: 2, b: 1, l: 0, corners: 0 },
      ],
    ], // center + top + left
    ['110110000', [{ t: 0, r: 1, b: 1, l: 0, corners: BR }]], // center + top + left + TL
    [
      '010011000',
      [
        { t: 0, r: 1, b: 1, l: 1, corners: BL },
        { t: 1, r: 0, b: 1, l: 2, corners: 0 },
      ],
    ], // center + top + right
    ['011011000', [{ t: 0, r: 0, b: 1, l: 1, corners: BL }]], // center + top + right + TR
    [
      '000110010',
      [
        { t: 1, r: 1, b: 0, l: 1, corners: TR },
        { t: 1, r: 2, b: 1, l: 0, corners: 0 },
      ],
    ], // center + bottom + left
    ['000110110', [{ t: 1, r: 1, b: 0, l: 0, corners: TR }]], // center + bottom + left + BL
    [
      '000011010',
      [
        { t: 1, r: 1, b: 0, l: 1, corners: TL },
        { t: 1, r: 0, b: 1, l: 2, corners: 0 },
      ],
    ], // center + bottom + right
    ['000011011', [{ t: 1, r: 0, b: 0, l: 1, corners: TL }]], // center + bottom + right + BR
    [
      '010110010',
      [
        { t: 0, r: 1, b: 0, l: 1, corners: 0 },
        { t: 1, r: 2, b: 1, l: 0, corners: 0 },
      ],
    ], // center + top + bottom + left
    [
      '110110010',
      [
        { t: 0, r: 1, b: 1, l: 0, corners: 0 },
        { t: 2, r: 1, b: 0, l: 1, corners: 0 },
      ],
    ], // center + top + bottom + left + TL
    [
      '010110110',
      [
        { t: 1, r: 1, b: 0, l: 0, corners: 0 },
        { t: 0, r: 1, b: 2, l: 1, corners: 0 },
      ],
    ], // center + top + bottom + left + BL
    ['110110110', [{ t: 0, r: 1, b: 0, l: 0, corners: 0 }]], // center + top + bottom + left + TL + BL
    [
      '010011010',
      [
        { t: 0, r: 1, b: 0, l: 1, corners: 0 },
        { t: 1, r: 0, b: 1, l: 2, corners: 0 },
      ],
    ], // center + top + bottom + right
    [
      '011011010',
      [
        { t: 0, r: 0, b: 1, l: 1, corners: 0 },
        { t: 2, r: 1, b: 0, l: 1, corners: 0 },
      ],
    ], // center + top + bottom + right + TR
    [
      '010011011',
      [
        { t: 1, r: 0, b: 0, l: 1, corners: 0 },
        { t: 0, r: 1, b: 2, l: 1, corners: 0 },
      ],
    ], // center + top + bottom + right + BR
    ['011011011', [{ t: 0, r: 0, b: 0, l: 1, corners: 0 }]], // center + top + bottom + right + TR + BR
    [
      '010111000',
      [
        { t: 1, r: 0, b: 1, l: 0, corners: 0 },
        { t: 0, r: 1, b: 2, l: 1, corners: 0 },
      ],
    ], // center + left + right + top
    [
      '110111000',
      [
        { t: 0, r: 1, b: 1, l: 0, corners: 0 },
        { t: 1, r: 0, b: 1, l: 2, corners: 0 },
      ],
    ], // center + left + right + top + TL
    [
      '011111000',
      [
        { t: 0, r: 0, b: 1, l: 1, corners: 0 },
        { t: 1, r: 2, b: 1, l: 0, corners: 0 },
      ],
    ], // center + left + right + top + TR
    ['111111000', [{ t: 0, r: 0, b: 1, l: 0, corners: 0 }]], // center + left + right + top + TL + TR
    [
      '000111010',
      [
        { t: 1, r: 0, b: 1, l: 0, corners: 0 },
        { t: 2, r: 1, b: 0, l: 1, corners: 0 },
      ],
    ], // center + left + right + bottom
    [
      '000111110',
      [
        { t: 1, r: 1, b: 0, l: 0, corners: 0 },
        { t: 1, r: 0, b: 1, l: 2, corners: 0 },
      ],
    ], // center + left + right + bottom + BL
    [
      '000111011',
      [
        { t: 1, r: 0, b: 0, l: 1, corners: 0 },
        { t: 1, r: 2, b: 1, l: 0, corners: 0 },
      ],
    ], // center + left + right + bottom + BR
    ['000111111', [{ t: 1, r: 0, b: 0, l: 0, corners: 0 }]], // center + left + right + bottom + BL + BR
    [
      '010111010',
      [
        { t: 0, r: 1, b: 0, l: 1, corners: 0 },
        { t: 1, r: 0, b: 1, l: 2, corners: 0 },
        { t: 1, r: 2, b: 1, l: 0, corners: 0 },
      ],
    ], // center + left + right + top + bottom
    [
      '110111010',
      [
        { t: 0, r: 1, b: 1, l: 0, corners: 0 },
        { t: 2, r: 1, b: 0, l: 1, corners: 0 },
        { t: 1, r: 0, b: 1, l: 2, corners: 0 },
      ],
    ], // center + left + right + top + bottom + TL
    [
      '011111010',
      [
        { t: 0, r: 0, b: 1, l: 1, corners: 0 },
        { t: 2, r: 1, b: 0, l: 1, corners: 0 },
        { t: 1, r: 2, b: 1, l: 0, corners: 0 },
      ],
    ], // center + left + right + top + bottom + TR
    [
      '010111110',
      [
        { t: 1, r: 1, b: 0, l: 0, corners: 0 },
        { t: 0, r: 1, b: 2, l: 1, corners: 0 },
        { t: 1, r: 0, b: 1, l: 2, corners: 0 },
      ],
    ], // center + left + right + top + bottom + BL
    [
      '010111011',
      [
        { t: 1, r: 0, b: 0, l: 1, corners: 0 },
        { t: 0, r: 1, b: 2, l: 1, corners: 0 },
        { t: 1, r: 2, b: 1, l: 0, corners: 0 },
      ],
    ], // center + left + right + top + bottom + BR
    [
      '111111010',
      [
        { t: 0, r: 0, b: 1, l: 0, corners: 0 },
        { t: 2, r: 1, b: 0, l: 1, corners: 0 },
      ],
    ], // center + left + right + top + bottom + TL + TR
    [
      '110111110',
      [
        { t: 0, r: 1, b: 0, l: 0, corners: 0 },
        { t: 1, r: 0, b: 1, l: 2, corners: 0 },
      ],
    ], // center + left + right + top + bottom + TL + BL
    [
      '110111011',
      [
        { t: 0, r: 1, b: 1, l: 0, corners: 0 },
        { t: 1, r: 0, b: 1, l: 2, corners: 0 },
        { t: 2, r: 0, b: 0, l: 1, corners: 0 },
      ],
    ], // center + left + right + top + bottom + TL + BR
    [
      '011111110',
      [
        { t: 0, r: 0, b: 1, l: 1, corners: 0 },
        { t: 1, r: 2, b: 1, l: 0, corners: 0 },
        { t: 2, r: 1, b: 0, l: 0, corners: 0 },
      ],
    ], // center + left + right + top + bottom + TR + BL
    [
      '011111011',
      [
        { t: 0, r: 0, b: 0, l: 1, corners: 0 },
        { t: 1, r: 2, b: 1, l: 0, corners: 0 },
      ],
    ], // center + left + right + top + bottom + TR + BR
    [
      '010111111',
      [
        { t: 1, r: 0, b: 0, l: 0, corners: 0 },
        { t: 0, r: 1, b: 2, l: 1, corners: 0 },
      ],
    ], // center + left + right + top + bottom + BL + BR
    [
      '111111110',
      [
        { t: 0, r: 0, b: 1, l: 0, corners: 0 },
        { t: 2, r: 1, b: 0, l: 0, corners: 0 },
      ],
    ], // center + left + right + top + bottom + TL + TR + BL
    [
      '111111011',
      [
        { t: 0, r: 0, b: 1, l: 0, corners: 0 },
        { t: 2, r: 0, b: 0, l: 1, corners: 0 },
      ],
    ], // center + left + right + top + bottom + TL + TR + BR
    [
      '110111111',
      [
        { t: 1, r: 0, b: 0, l: 0, corners: 0 },
        { t: 0, r: 1, b: 2, l: 0, corners: 0 },
      ],
    ], // center + left + right + top + bottom + BL + BR + TL
    [
      '011111111',
      [
        { t: 1, r: 0, b: 0, l: 0, corners: 0 },
        { t: 0, r: 0, b: 2, l: 1, corners: 0 },
      ],
    ], // center + left + right + top + bottom + BL + BR + TR
    ['111111111', [{ t: 0, r: 0, b: 0, l: 0, corners: 0 }]], // center + left + right + top + bottom + TL + TR + BL + BR
  ])
);

type TileStyles = {
  style: React.CSSProperties;
  fixable: boolean;
  focusable: boolean;
}[];

function getEm(id: 0 | 1 | 2) {
  switch (id) {
    case 0:
      return 0;
    case 1:
      return 0.05;
    case 2:
      return 0.95;
  }
}

const tileStyles = Object.freeze(
  new Map<string, TileStyles>(
    [...tileShapes.entries()].map(([key, shape]) => {
      let focused = false;
      return [
        key,
        shape.map(part => ({
          style: {
            top: getEm(part.t) + 'em',
            left: getEm(part.l) + 'em',
            bottom: getEm(part.b) + 'em',
            right: getEm(part.r) + 'em',
            width: `${1 - getEm(part.l) - getEm(part.r)}em`,
            height: `${1 - getEm(part.t) - getEm(part.b)}em`,
            borderTopLeftRadius: part.corners & TL ? '0.125em' : 0,
            borderTopRightRadius: part.corners & TR ? '0.125em' : 0,
            borderBottomLeftRadius: part.corners & BL ? '0.125em' : 0,
            borderBottomRightRadius: part.corners & BR ? '0.125em' : 0,
          },
          fixable: part.b === 1 && part.l === 1 && part.r === 1 && part.t === 1,
          focusable:
            !focused && part.t <= 1 && part.r <= 1 && part.b <= 1 && part.l <= 1
              ? (focused = true)
              : false,
        })),
      ];
    })
  )
);

export default memo(function Tile({
  data,
  editable,
  connections,
  onTileClick,
}: TileProps) {
  const partStyles = useMemo(() => {
    let key = '';
    for (let y = -1; y <= 1; y++) {
      for (let x = -1; x <= 1; x++) {
        key += connections[y][x] ? '1' : '0';
      }
    }
    const styles = tileStyles.get(key);
    if (!styles) throw new Error(`No style for key ${key}`);
    return styles;
  }, [connections]);
  let fixed = false;

  return (
    <div className="relative w-[1em] h-[1em] logic-tile">
      {data.exists && (
        <>
          {partStyles.map(({ style, fixable, focusable }, i) => (
            <button
              key={i}
              className={cn(
                'absolute btn no-animation transition-none duration-0 p-0 shadow-none min-h-0 text-[1em]',
                bg(data.color),
                editable ? 'cursor-pointer' : 'cursor-default',
                fixable && data.fixed
                  ? ((fixed = true), 'tile-fixed')
                  : 'border-0'
              )}
              tabIndex={
                editable && !data.fixed && focusable ? 0 : -1 // dirty hack to make only the central button focusable
              }
              style={style}
              onPointerDown={e => {
                e.preventDefault();
                if (!editable) return;
                if (e.pointerType === 'mouse') {
                  let c = mouseContext.getColorForButtons(e.buttons);
                  if (!c) {
                    mouseContext.setColor(null, false);
                  } else {
                    if (c === data.color) c = Color.Gray;
                    mouseContext.setColor(
                      c,
                      c !== Color.Gray && data.color !== Color.Gray
                    );
                    onTileClick?.(c, e.ctrlKey);
                  }
                }
              }}
              onPointerUp={e => {
                e.preventDefault();
                if (!editable) return;
                mouseContext.setColor(null, false);
                if (e.pointerType !== 'mouse') {
                  let c = mouseContext.getColorForButtons(1);
                  if (c) {
                    if (c === data.color) c = Color.Gray;
                    onTileClick?.(c, e.ctrlKey);
                  }
                }
              }}
              onPointerEnter={e => {
                e.preventDefault();
                if (!editable) return;
                const c = mouseContext.getColorForButtons(e.buttons);
                if (
                  !c ||
                  !mouseContext.color ||
                  (c !== mouseContext.color &&
                    mouseContext.color !== Color.Gray)
                ) {
                  mouseContext.setColor(null, false);
                } else {
                  if (mouseContext.color === data.color) return;
                  if (
                    mouseContext.color === Color.Gray ||
                    data.color === Color.Gray ||
                    mouseContext.replacing
                  )
                    onTileClick?.(mouseContext.color, e.ctrlKey);
                }
              }}
            ></button>
          ))}
          {!fixed && data.fixed && (
            <div
              key="fixed"
              className="absolute inset-[0.05em] text-[1em] pointer-events-none tile-fixed"
            ></div>
          )}
        </>
      )}
    </div>
  );
});
