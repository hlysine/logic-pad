import { memo, useEffect, useMemo, useRef, useState } from 'react';
import MainGrid from '../grid/MainGrid';
import InstructionList from '../instructions/InstructionList';
import { cn } from '../uiHelper';
import Metadata from '../metadata/Metadata';
import Loading from './Loading';
import html2canvas from 'html2canvas-pro';

export interface PuzzleImageGeneratorProps {
  className?: string;
}

const CopyImage = memo(function CopyImage({
  canvas,
}: {
  canvas?: HTMLCanvasElement | null;
}) {
  const [tooltip, setTooltip] = useState<string | null>(null);
  useEffect(() => {
    if (tooltip && tooltip.length > 0) {
      const timeout = window.setTimeout(() => setTooltip(null), 2000);
      return () => clearTimeout(timeout);
    }
  }, [tooltip]);
  return (
    <div
      className={cn(
        'tooltip tooltip-info tooltip-top flex-1',
        tooltip && 'tooltip-open'
      )}
      data-tip={tooltip}
    >
      <button
        className="btn btn-primary w-full"
        disabled={!canvas}
        onClick={() => {
          if (!canvas) return;
          canvas.toBlob(async blob => {
            if (!blob) return;
            const item = new ClipboardItem({ 'image/png': blob });
            await navigator.clipboard.write([item]);
            setTooltip('Copied!');
          });
        }}
      >
        Copy to clipboard
      </button>
    </div>
  );
});

const PuzzleImage = memo(function PuzzleImage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
  const image = useMemo(() => {
    if (canvas) {
      return <img src={canvas.toDataURL()} />;
    } else {
      return <Loading />;
    }
  }, [canvas]);
  useEffect(() => {
    setTimeout(() => {
      if (!containerRef.current) return;
      // Workaround for https://github.com/yorickshan/html2canvas-pro/issues/108
      document.querySelectorAll('slot').forEach(slot => {
        slot.assignedNodes = () => [...slot.childNodes];
      });

      html2canvas(containerRef.current, {
        foreignObjectRendering: true,
        x: 1,
        y: 1,
        windowHeight: 1080,
        windowWidth: 1920,
        onclone(document, element) {
          element.parentElement?.removeChild(element);
          document.body.appendChild(element);
          element.style.opacity = '1';
          document.body.style.backgroundColor = element.style.backgroundColor;
        },
      })
        .then(result => {
          const croppedCanvas = document.createElement('canvas');
          croppedCanvas.width = result.width - 2;
          croppedCanvas.height = result.height - 2;
          const ctx = croppedCanvas.getContext('2d');
          if (!ctx) return;
          ctx.drawImage(
            result,
            0,
            0,
            croppedCanvas.width,
            croppedCanvas.height,
            0,
            0,
            croppedCanvas.width,
            croppedCanvas.height
          );
          setCanvas(croppedCanvas);
        })
        .catch(console.error);
    }, 1000);
  }, []);
  return (
    <div
      tabIndex={0}
      className="dropdown-content flex flex-col gap-4 bg-base-100 rounded-box z-[1] w-full max-w-[320px] p-4 shadow mb-4 overflow-hidden"
    >
      <div
        ref={containerRef}
        className="fixed top-0 left-0 shrink-0 w-fit h-fit flex gap-1 py-4 pl-4 items-center bg-neutral border-0 pointer-events-none opacity-0"
      >
        <div className="flex flex-col gap-4">
          <Metadata simplified={true} responsive={false} />
          <MainGrid useToolboxClick={false} animated={false} />
        </div>
        <div className="pr-2">
          <InstructionList responsive={false} />
        </div>
      </div>
      {image}
      <CopyImage canvas={canvas} />
    </div>
  );
});

export default memo(function PuzzleImageGenerator({
  className,
}: PuzzleImageGeneratorProps) {
  const [open, setOpen] = useState(false);
  return (
    <div className="dropdown dropdown-open dropdown-top w-full max-w-[320px] self-center">
      <div
        tabIndex={0}
        role="button"
        className={cn('btn btn-sm lg:btn-md w-full', className)}
        onClick={() => setOpen(v => !v)}
      >
        {open ? 'Close' : 'Share Puzzle Image'}
      </div>
      {open && <PuzzleImage />}
    </div>
  );
});
