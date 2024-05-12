import { memo, useRef } from 'react';
import { Color } from '../../data/primitives';
import mouseContext from './MouseContext';

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
}: PointerCaptureOverlayProps) {
  allowDrag = allowDrag ?? true;
  allowReplace = allowReplace ?? false;
  step = step ?? 1;

  const prevCoord = useRef({ x: -1, y: -1 });

  const getPointerLocation = (
    e: React.PointerEvent<HTMLDivElement>,
    targetColor: Color
  ) => {
    const rect = e.currentTarget.getBoundingClientRect();
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
    const currentColor = colorMap(x, y, targetColor) ? targetColor : Color.Gray;
    return { x, y, currentColor };
  };

  return (
    <div
      className="absolute inset-0"
      onPointerDown={e => {
        e.preventDefault();
        if (e.pointerType === 'mouse') {
          let targetColor = mouseContext.getColorForButtons(e.buttons);
          if (!targetColor) {
            mouseContext.setColor(null, false);
          } else {
            const { x, y, currentColor } = getPointerLocation(e, targetColor);
            if (currentColor !== Color.Gray) targetColor = Color.Gray;
            mouseContext.setColor(
              targetColor,
              allowReplace &&
                targetColor !== Color.Gray &&
                getPointerLocation(e, opposite(targetColor)).currentColor !==
                  Color.Gray
            );
            onTileClick?.(x, y, currentColor, targetColor, e.ctrlKey);
          }
        }
      }}
      onPointerUp={e => {
        e.preventDefault();
        const color = mouseContext.color ?? Color.Gray;
        mouseContext.setColor(null, false);
        if (e.pointerType !== 'mouse') {
          let targetColor = mouseContext.getColorForButtons(1);
          if (targetColor) {
            const { x, y, currentColor } = getPointerLocation(e, targetColor);
            if (targetColor === currentColor) targetColor = Color.Gray;
            onTileClick?.(x, y, currentColor, targetColor, e.ctrlKey);
          }
        }
        onPointerUp?.(color);
      }}
      onPointerMove={e => {
        e.preventDefault();
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
          const { x, y, currentColor } = getPointerLocation(e, targetColor);

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
    ></div>
  );
});
