import { memo, useMemo, useState } from 'react';
import ToolboxItem from '../ToolboxItem';
import { useGrid } from '../../contexts/GridContext';
import { TbClipboard } from 'react-icons/tb';
import { Position } from '@logic-pad/core/data/primitives';
import { cn } from '../../uiHelper';
import { Serializer } from '@logic-pad/core/data/serializer/allSerializers';
import { Compressor } from '@logic-pad/core/data/serializer/compressor/allCompressors';
import toast from 'react-hot-toast';
import GridData from '@logic-pad/core/data/grid';
import { FaPaste } from 'react-icons/fa';
import debounce from 'lodash/debounce';
import { useHotkeys } from 'react-hotkeys-hook';

export function ClipboardToolOverlay() {
  const { grid, setGrid } = useGrid();
  const [firstPosition, setFirstPosition] = useState<Position | null>(null);
  const [currentPosition, setCurrentPosition] = useState<Position | null>(null);
  const [clipboardData, setClipboardData] = useState<GridData | null>(null);

  const getPointerLocation = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * grid.width;
    const y = ((e.clientY - rect.top) / rect.height) * grid.height;
    return { x, y };
  };

  const selectionStyle = useMemo(() => {
    if (!firstPosition && !currentPosition) return {};
    if (!firstPosition && currentPosition) {
      return {
        left: `${Math.min(currentPosition.x)}em`,
        top: `${Math.min(currentPosition.y)}em`,
        width: `1em`,
        height: `1em`,
      };
    } else if (firstPosition) {
      const x1 = Math.min(
        firstPosition.x,
        currentPosition?.x ?? firstPosition.x
      );
      const y1 = Math.min(
        firstPosition.y,
        currentPosition?.y ?? firstPosition.y
      );
      const x2 = Math.max(
        firstPosition.x,
        currentPosition?.x ?? firstPosition.x
      );
      const y2 = Math.max(
        firstPosition.y,
        currentPosition?.y ?? firstPosition.y
      );
      return {
        left: `${x1}em`,
        top: `${y1}em`,
        width: `${x2 - x1 + 1}em`,
        height: `${y2 - y1 + 1}em`,
      };
    }
  }, [firstPosition, currentPosition]);

  const parseClipboard = useMemo(
    () =>
      debounce(async () => {
        const clipboardText = await navigator.clipboard.readText();
        try {
          const decompressed = await Compressor.decompress(clipboardText);
          const gridData = Serializer.parseGrid(decompressed);
          setClipboardData(gridData);
        } catch {
          setClipboardData(null);
        }
      }, 500),
    []
  );

  const pasteGrid = (position: Position) => {
    setFirstPosition(null);
    setCurrentPosition(null);
    if (!clipboardData) return;
    setGrid(grid.pasteTiles(position, clipboardData));
  };

  useHotkeys('ctrl+v, cmd+v', async () => {
    await parseClipboard();
    if (!clipboardData || !currentPosition) return;
    pasteGrid(firstPosition ?? currentPosition);
  });

  return (
    <>
      <div
        className="absolute inset-0"
        onPointerEnter={async () => {
          await parseClipboard();
        }}
        onPointerUp={async () => {
          if (!currentPosition) return;
          if (!firstPosition) {
            setFirstPosition(currentPosition);
          } else {
            const x1 = Math.min(firstPosition.x, currentPosition.x);
            const y1 = Math.min(firstPosition.y, currentPosition.y);
            const width = Math.abs(firstPosition.x - currentPosition.x) + 1;
            const height = Math.abs(firstPosition.y - currentPosition.y) + 1;
            const newGrid = grid.copyTiles({ x: x1, y: y1 }, width, height);
            const data = await Compressor.compress(
              Serializer.stringifyGrid(newGrid)
            );
            await navigator.clipboard.writeText(data);
            toast.success('Copied selection to clipboard');
            setFirstPosition(null);
            setCurrentPosition(null);
            setClipboardData(newGrid);
          }
        }}
        onPointerMove={e => {
          let { x, y } = getPointerLocation(e);
          x = Math.max(0, Math.min(grid.width, Math.floor(x)));
          y = Math.max(0, Math.min(grid.height, Math.floor(y)));
          setCurrentPosition({ x, y });
        }}
        onPointerLeave={() => setCurrentPosition(null)}
      >
        {clipboardData && firstPosition && (
          <button
            className="absolute btn btn-info btn-circle text-[1em] transition-all opacity-30 hover:opacity-100 peer tooltip tooltip-info tooltip-top"
            data-tip="Paste here"
            style={{
              left: `${firstPosition.x + 0.1}em`,
              top: `${firstPosition.y + 0.1}em`,
            }}
            onPointerUp={e => {
              e.stopPropagation();
              pasteGrid(firstPosition);
            }}
          >
            <FaPaste className="absolute inset-0 m-auto" size={24} />
          </button>
        )}
        <div
          className={cn(
            'absolute bg-transparent border-4 border-dashed rounded-[0.1em] pointer-events-none transition-all peer-hover:opacity-30',
            firstPosition ? 'border-info' : 'border-accent',
            !firstPosition && !currentPosition && 'hidden'
          )}
          style={selectionStyle}
        ></div>
      </div>
    </>
  );
}

export default memo(function ResizeRowTool() {
  return (
    <ToolboxItem
      id="clipboard"
      order={6}
      name="Clipboard"
      description="Select two positions to copy tiles. Select a position and click to paste. You can also paste with Ctrl+V."
      hotkey="tools-5"
      gridOverlay={<ClipboardToolOverlay />}
      onTileClick={null}
    >
      <TbClipboard />
    </ToolboxItem>
  );
});
