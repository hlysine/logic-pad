import { memo } from 'react';
import ToolboxItem from '../ToolboxItem';
import { Color } from '@logic-pad/core/data/primitives';
import { useGrid } from '../../contexts/GridContext';
import PointerCaptureOverlay from '../../grid/PointerCaptureOverlay';
import { TbFrame } from 'react-icons/tb';

function ZoneToolOverlay() {
  const { grid, setGrid } = useGrid();
  return (
    <PointerCaptureOverlay
      width={grid.width}
      height={grid.height}
      step={0.01}
      colorMap={() => false}
      onTileClick={(x, y, from, to) => {
        if (x < 0 || y < 0 || x >= grid.width || y >= grid.height) {
          return;
        }
        const tx = Math.floor(x);
        const ty = Math.floor(y);
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
        const newEdge = { x1: tx, y1: ty, x2: cx, y2: cy };
        if (from === Color.Dark || to === Color.Dark) {
          if (!grid.zones.hasEdge(newEdge)) {
            setGrid(grid.withZones(z => z.addEdge(newEdge)));
          }
        } else if (from === Color.Light || to === Color.Light) {
          if (grid.zones.hasEdge(newEdge)) {
            setGrid(grid.withZones(z => z.removeEdge(newEdge)));
          }
        }
      }}
    />
  );
}

export default memo(function ZoneTool() {
  return (
    <ToolboxItem
      id="zone"
      order={6}
      name="Define zones"
      description="Left click a gap to add an edge. Right click to remove."
      hotkey="h"
      gridOverlay={<ZoneToolOverlay />}
      onTileClick={null}
    >
      <TbFrame />
    </ToolboxItem>
  );
});
