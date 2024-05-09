import { PartPlacement, PartSpec } from './types';
import { instance as musicGridInstance } from '../../../data/rules/musicGridRule';
import { memo, useEffect, useMemo, useRef, useState } from 'react';
import * as Tone from 'tone';
import { useGrid } from '../../GridContext';
import GridRawCanvasOverlay, {
  RawCanvasRef,
} from '../../grid/GridRawCanvasOverlay';
import { useTheme } from '../../ThemeContext';

export default memo(function MusicOverlayPart() {
  const { grid } = useGrid();
  const canvasRef = useRef<RawCanvasRef>(null);
  const targetRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const [targetPosition, setTargetPosition] = useState(0);

  const infoColor = useMemo(
    () =>
      window.getComputedStyle(document.getElementById('color-ref-info')!).color,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [theme]
  );

  useEffect(() => {
    const handle = Tone.getTransport().scheduleRepeat(time => {
      Tone.getDraw().schedule(() => {
        const position = Tone.getTransport().ticks / Tone.getTransport().PPQ;
        if (canvasRef.current) {
          const { ctx, tileSize } = canvasRef.current;
          ctx.clearRect(0, 0, grid.width * tileSize, grid.height * tileSize);
          if (position >= grid.width || position <= 0) return;
          ctx.fillStyle = infoColor;
          ctx.fillRect(
            (position % grid.width) * tileSize,
            0,
            5,
            grid.height * tileSize
          );
          setTargetPosition(position);
        }
      }, time);
    }, 0.01);
    return () => {
      Tone.getTransport().clear(handle);
    };
  }, [grid.height, grid.width, infoColor]);

  useEffect(() => {
    targetRef.current?.scrollIntoView({ behavior: 'instant' });
  }, [targetPosition]);

  return (
    <GridRawCanvasOverlay
      ref={canvasRef}
      width={grid.width}
      height={grid.height}
    >
      <div
        ref={targetRef}
        className="absolute w-48 h-0 opacity-0"
        style={{ left: `${targetPosition}em`, top: '50%' }}
      ></div>
    </GridRawCanvasOverlay>
  );
});

export const spec: PartSpec = {
  placement: PartPlacement.GridOverlay,
  instructionId: musicGridInstance.id,
};
