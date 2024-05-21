import { memo, useRef } from 'react';
import ToolboxItem from '../ToolboxItem';
import { Color, Position } from '../../../data/primitives';
import { RiMergeCellsHorizontal } from 'react-icons/ri';
import { useGrid } from '../../contexts/GridContext.tsx';
import PointerCaptureOverlay from '../../grid/PointerCaptureOverlay';

function MergeToolOverlay() {
  const { grid, setGrid } = useGrid();
  const location = useRef<Position | null>(null);
  return (
    <PointerCaptureOverlay
      width={grid.width}
      height={grid.height}
      colorMap={() => false}
      onTileClick={(x, y, from, to) => {
        if (x < 0 || y < 0 || x >= grid.width || y >= grid.height) {
          location.current = null;
          return;
        }
        if (location.current === null) {
          location.current = { x, y };
          return;
        }
        if (
          Math.abs(location.current.x - x) +
            Math.abs(location.current.y - y) ===
          1
        ) {
          if (from === Color.Dark || to === Color.Dark) {
            setGrid(
              grid.withConnections(con =>
                con.addEdge({
                  x1: x,
                  y1: y,
                  x2: location.current!.x,
                  y2: location.current!.y,
                })
              )
            );
          } else if (from === Color.Light || to === Color.Light) {
            setGrid(
              grid.withConnections(con =>
                con.removeEdge({
                  x1: x,
                  y1: y,
                  x2: location.current!.x,
                  y2: location.current!.y,
                })
              )
            );
          }
        }
        location.current = { x, y };
      }}
      onPointerUp={() => (location.current = null)}
    />
  );
}

export default memo(function MergeTool() {
  return (
    <ToolboxItem
      id="merge"
      order={3}
      name="Merge tiles"
      description="Left click and drag to merge tiles. Right click and drag to split tiles."
      hotkey="d"
      gridOverlay={<MergeToolOverlay />}
      onTileClick={null}
    >
      <RiMergeCellsHorizontal />
    </ToolboxItem>
  );
});
