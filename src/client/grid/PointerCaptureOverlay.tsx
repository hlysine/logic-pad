import { memo, useMemo, useRef } from 'react';
import { Color } from '@logic-pad/core/data/primitives';
import mouseContext from './MouseContext';
import { cn } from '../uiHelper';

export interface PointerCaptureOverlayProps {
  width: number;
  height: number;
  colorMap: (x: number, y: number, color: Color) => boolean;
  onTileClick: (
    x: number,
    y: number,
    from: Color,
    to: Color,
    flood: boolean
  ) => void;
  allowDrag?: boolean;
  allowReplace?: boolean;
  step?: number;
  onPointerUp?: (color: Color) => void;
  onPointerMove?: (x: number, y: number) => void;
  bleed?: number | { top: number; right: number; bottom: number; left: number };
  children?: React.ReactNode;
  className?: string;
}

function opposite(color: Color) {
  switch (color) {
    case Color.Dark:
      return Color.Light;
    case Color.Light:
      return Color.Dark;
    default:
      return Color.Gray;
  }
}

export default memo(function PointerCaptureOverlay({
  width,
  height,
  colorMap,
  onTileClick,
  allowDrag,
  allowReplace,
  step,
  onPointerUp,
  onPointerMove,
  bleed,
  children,
  className,
}: PointerCaptureOverlayProps) {
  allowDrag = allowDrag ?? true;
  allowReplace = allowReplace ?? false;
  step = step ?? 1;
  bleed = bleed ?? 0;
  if (typeof bleed === 'number')
    bleed = { top: bleed, right: bleed, bottom: bleed, left: bleed };

  const prevCoord = useRef({ x: -1, y: -1 });

  const getPointerLocation = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const widthUnit = rect.width / (width + bleed.left + bleed.right);
    const heightUnit = rect.height / (height + bleed.top + bleed.bottom);
    rect.x += bleed.left * widthUnit;
    rect.y += bleed.top * heightUnit;
    rect.width -= (bleed.left + bleed.right) * widthUnit;
    rect.height -= (bleed.top + bleed.bottom) * heightUnit;
    const x =
      Math.floor(
        (((e.clientX - rect.left) / rect.width) * width -
          (step === 0.5 ? 0.25 : 0)) /
          step
      ) * step;
    const y =
      Math.floor(
        (((e.clientY - rect.top) / rect.height) * height -
          (step === 0.5 ? 0.25 : 0)) /
          step
      ) * step;
    return { x, y };
  };

  const getPointerColor = (x: number, y: number, targetColor: Color) => {
    const currentColor = colorMap(x, y, targetColor) ? targetColor : Color.Gray;
    return currentColor;
  };

  return (
    <div
      className={cn('absolute', className)}
      style={useMemo(
        () => ({
          left: `${-bleed.left}em`,
          right: `${-bleed.right}em`,
          top: `${-bleed.top}em`,
          bottom: `${-bleed.bottom}em`,
        }),
        [bleed]
      )}
      onPointerDown={e => {
        if (e.pointerType === 'mouse') {
          let targetColor = mouseContext.getColorForButtons(e.buttons);
          if (!targetColor) {
            mouseContext.setColor(null, false);
          } else {
            const { x, y } = getPointerLocation(e);
            const currentColor = getPointerColor(x, y, targetColor);
            if (currentColor !== Color.Gray) targetColor = Color.Gray;
            mouseContext.setColor(
              targetColor,
              allowReplace &&
                targetColor !== Color.Gray &&
                getPointerColor(x, y, opposite(targetColor)) !== Color.Gray
            );
            onTileClick?.(x, y, currentColor, targetColor, e.ctrlKey);
          }
        }
      }}
      onPointerUp={e => {
        const color = mouseContext.color ?? Color.Gray;
        mouseContext.setColor(null, false);
        if (e.pointerType !== 'mouse') {
          let targetColor = mouseContext.getColorForButtons(1);
          if (targetColor) {
            const { x, y } = getPointerLocation(e);
            const currentColor = getPointerColor(x, y, targetColor);
            if (targetColor === currentColor) targetColor = Color.Gray;
            onTileClick?.(x, y, currentColor, targetColor, e.ctrlKey);
          }
        }
        onPointerUp?.(color);
      }}
      onPointerMove={e => {
        const hoverLocation = getPointerLocation(e);
        onPointerMove?.(hoverLocation.x, hoverLocation.y);
        if (!allowDrag) return;
        const targetColor = mouseContext.getColorForButtons(e.buttons);
        if (
          !targetColor ||
          !mouseContext.color ||
          (targetColor !== mouseContext.color &&
            mouseContext.color !== Color.Gray)
        ) {
          mouseContext.setColor(null, false);
        } else {
          const { x, y } = getPointerLocation(e);
          const currentColor = getPointerColor(x, y, targetColor);

          if (x === prevCoord.current.x && y === prevCoord.current.y) return;
          prevCoord.current = { x, y };

          if (mouseContext.color === currentColor) return;
          if (
            mouseContext.color === Color.Gray ||
            currentColor === Color.Gray ||
            mouseContext.replacing
          )
            onTileClick(x, y, currentColor, mouseContext.color, e.ctrlKey);
        }
      }}
      onPointerLeave={() => (prevCoord.current = { x: -1, y: -1 })}
    >
      {children}
    </div>
  );
});
