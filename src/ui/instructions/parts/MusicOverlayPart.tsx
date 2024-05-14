import { PartPlacement, PartSpec } from './types';
import { instance as musicGridInstance } from '../../../data/rules/musicGridRule';
import { memo, useEffect, useMemo, useRef, useState } from 'react';
import * as Tone from 'tone';
import { useGrid } from '../../GridContext';
import GridCanvasOverlay, { RawCanvasRef } from '../../grid/GridCanvasOverlay';
import { useTheme } from '../../ThemeContext';
import { playbackState } from './piano';
import { Color } from '../../../data/primitives';

const BLEED = 5;

export default memo(function MusicOverlayPart() {
  const { grid } = useGrid();
  const canvasRef = useRef<RawCanvasRef>(null);
  const [tileSize, setTileSize] = useState(0);
  const targetRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const [targetPosition, setTargetPosition] = useState(0);
  const tileAnimations = useRef<number[][]>([]);
  const prevPosition = useRef(-1);

  useEffect(() => {
    tileAnimations.current = Array.from({ length: grid.height }, () =>
      Array.from({ length: grid.width }, () => 0)
    );
  }, [grid.height, grid.width]);

  const infoColor = useMemo(
    () =>
      window.getComputedStyle(document.getElementById('color-ref-info')!).color,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [theme]
  );

  const accentColor = useMemo(
    () =>
      window.getComputedStyle(document.getElementById('color-ref-accent')!)
        .color,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [theme]
  );

  useEffect(() => {
    const handler = () => {
      prevPosition.current = -1;
    };
    Tone.getTransport().on('stop', handler);
    return () => {
      Tone.getTransport().off('stop', handler);
    };
  }, []);

  useEffect(() => {
    const handle = Tone.getTransport().scheduleRepeat(
      time => {
        Tone.getDraw().schedule(() => {
          const position = Tone.getTransport().ticks / Tone.getTransport().PPQ;
          const prevPos = prevPosition.current;
          prevPosition.current = position;
          if (canvasRef.current && tileSize !== 0) {
            const { ctx } = canvasRef.current;
            ctx.clearRect(
              -BLEED,
              -BLEED,
              grid.width * tileSize + BLEED * 2,
              grid.height * tileSize + BLEED * 2
            );
            if (!playbackState.isSolution) {
              for (let y = 0; y < grid.height; y++) {
                for (let x = 0; x < grid.width; x++) {
                  if (tileAnimations.current[y][x] > 0) {
                    ctx.fillStyle = `${accentColor.substring(0, accentColor.length - 2)}/${
                      tileAnimations.current[y][x]
                    })`;
                    ctx.fillRect(
                      x * tileSize,
                      y * tileSize,
                      tileSize,
                      tileSize
                    );
                    tileAnimations.current[y][x] /= 1.06;
                  }
                }
              }
            }
            if (position >= grid.width || position <= 0) return;
            const column = Math.floor(position);
            if (column !== Math.floor(prevPos)) {
              for (let y = 0; y < grid.height; y++) {
                const tile = grid.getTile(column, y);
                if (!tile.exists || tile.color !== Color.Dark) continue;
                tileAnimations.current[y][column] = 0.7;
              }
            }
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo((position % grid.width) * tileSize, 0);
            ctx.lineTo(
              (position % grid.width) * tileSize,
              grid.height * tileSize
            );
            ctx.lineWidth = 5;
            ctx.strokeStyle = playbackState.isSolution
              ? infoColor
              : accentColor;
            ctx.stroke();
            setTargetPosition(position);
          }
        }, time);
      },
      0.01,
      0
    );
    return () => {
      Tone.getTransport().clear(handle);
    };
  }, [grid, infoColor, accentColor, tileSize]);

  useEffect(() => {
    targetRef.current?.scrollIntoView({ behavior: 'instant' });
  }, [targetPosition]);

  return (
    <GridCanvasOverlay
      ref={canvasRef}
      width={grid.width}
      height={grid.height}
      bleed={BLEED}
      onResize={size => setTileSize(size)}
    >
      <div
        ref={targetRef}
        className="absolute w-48 h-0 opacity-0 -top-12 xl:top-1/2"
        style={{ left: `${targetPosition}em` }}
      ></div>
    </GridCanvasOverlay>
  );
});

export const spec: PartSpec = {
  placement: PartPlacement.GridOverlay,
  instructionId: musicGridInstance.id,
};
