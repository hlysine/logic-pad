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
      step={0.01}
      colorMap={() => false}
      onTileClick={(x, y, from, to) => {
        if (x < 0 || y < 0 || x >= grid.width || y >= grid.height) {
          location.current = null;
          return;
        }
        const tx = Math.floor(x);
        const ty = Math.floor(y);
        if (
          location.current != null &&
          location.current.x === tx &&
          location.current.y === ty
        ) {
          return;
        }
        let cx, cy;
        if (Math.abs(tx + 0.5 - x) < 0.25 && Math.abs(ty + 0.5 - y) < 0.25)
          return;
        if (Math.abs(tx + 0.5 - x) > Math.abs(ty + 0.5 - y)) {
          cx = x > tx + 0.5 ? tx + 1 : tx - 1;
          cy = ty;
        } else {
          cx = tx;
          cy = y > ty + 0.5 ? ty + 1 : ty - 1;
        }
        if (from === Color.Dark || to === Color.Dark) {
          setGrid(
            grid.withConnections(con =>
              con.addEdge({
                x1: tx,
                y1: ty,
                x2: cx,
                y2: cy,
              })
            )
          );
        } else if (from === Color.Light || to === Color.Light) {
          setGrid(
            grid.withConnections(con =>
              con.removeEdge({
                x1: tx,
                y1: ty,
                x2: cx,
                y2: cy,
              })
            )
          );
        }
        location.current = { x: tx, y: ty };
      }}
    />
  );
}

export default memo(function MergeTool() {
  return (
    <ToolboxItem
      id="merge"
      order={5}
      name="Merge tiles"
      description="Left click a gap to merge tiles. Right click to split tiles."
      hotkey="t"
      gridOverlay={<MergeToolOverlay />}
      onTileClick={null}
    >
      <RiMergeCellsHorizontal />
    </ToolboxItem>
  );
});
