import {
  ForwardedRef,
  forwardRef,
  memo,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import GridOverlay from './GridOverlay';

export interface GridRawCanvasOverlayProps {
  width: number;
  height: number;
  bleed?: number;
  children?: React.ReactNode;
}

export interface RawCanvasRef {
  ctx: CanvasRenderingContext2D;
  tileSize: number;
}

export default memo(
  forwardRef(function GridRawCanvasOverlay(
    { width, height, bleed, children }: GridRawCanvasOverlayProps,
    ref: ForwardedRef<RawCanvasRef>
  ) {
    bleed ??= 0;
    const overlayRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [tileSize, setTileSize] = useState(0);
    useImperativeHandle(
      ref,
      () => {
        if (!canvasRef.current) {
          throw new Error('Canvas ref not set');
        }
        const ctx = canvasRef.current.getContext('2d');
        if (!ctx) {
          throw new Error('Could not get canvas context');
        }
        ctx.translate(bleed, bleed);
        return { ctx, tileSize };
      },
      [tileSize, bleed]
    );

    useEffect(() => {
      if (overlayRef.current) {
        const { current } = overlayRef;
        const resizeHandler = () => {
          const divWidth = current.offsetWidth;
          setTileSize(divWidth / width);
        };
        resizeHandler();
        const observer = new ResizeObserver(resizeHandler);
        observer.observe(current);
        return () => observer.disconnect();
      }
    }, [width]);

    return (
      <GridOverlay ref={overlayRef}>
        <canvas
          ref={canvasRef}
          width={width * tileSize + bleed * 2}
          height={height * tileSize + bleed * 2}
          style={{ top: -bleed, left: -bleed }}
          className="absolute"
        ></canvas>
        {children}
      </GridOverlay>
    );
  })
);
