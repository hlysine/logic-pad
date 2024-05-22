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

export interface GridCanvasOverlayProps {
  width: number;
  height: number;
  bleed?: number;
  children?: React.ReactNode;
  onResize?: (tileSize: number) => void;
}

export interface RawCanvasRef {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
}

export default memo(
  forwardRef(function GridCanvasOverlay(
    { width, height, bleed, children, onResize }: GridCanvasOverlayProps,
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
        return { canvas: canvasRef.current, ctx };
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [bleed, tileSize]
    );

    useEffect(() => {
      if (overlayRef.current) {
        const { current } = overlayRef;
        const resizeHandler = () => {
          const divWidth = current.offsetWidth;
          const newSize = width === 0 ? 0 : divWidth / width;
          setTileSize(newSize);
          onResize?.(newSize);
        };
        resizeHandler();
        const observer = new ResizeObserver(resizeHandler);
        observer.observe(current);
        return () => observer.disconnect();
      }
    }, [onResize, width]);

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
