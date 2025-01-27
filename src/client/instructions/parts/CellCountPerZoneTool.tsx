import { memo } from 'react';
import ToolboxItem from '../../editor/ToolboxItem';
import { Color } from '@logic-pad/core/data/primitives';
import { useGrid } from '../../contexts/GridContext';
import PointerCaptureOverlay from '../../grid/PointerCaptureOverlay';
import { PartPlacement, PartSpec } from './types';
import CellCountPerZoneRule, {
  instance as cellCountPerZoneInstance,
} from '@logic-pad/core/data/rules/cellCountPerZoneRule';
import { TbFrame } from 'react-icons/tb';

function CellCountPerZoneToolOverlay() {
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
        if (from === Color.Dark || to === Color.Dark) {
          if (
            (
              grid.findRule(r => r.id === cellCountPerZoneInstance.id) as
                | CellCountPerZoneRule
                | undefined
            )?.edges.every(
              e => e.x1 !== tx || e.y1 !== ty || e.x2 !== cx || e.y2 !== cy
            )
          ) {
            const newEdge = { x1: tx, y1: ty, x2: cx, y2: cy };
            setGrid(
              grid.withRules(rules =>
                rules.map(r =>
                  r.id === cellCountPerZoneInstance.id
                    ? (r as CellCountPerZoneRule).withEdges(edges => [
                        ...edges,
                        newEdge,
                      ])
                    : r
                )
              )
            );
          }
        } else if (from === Color.Light || to === Color.Light) {
          if (
            (
              grid.findRule(r => r.id === cellCountPerZoneInstance.id) as
                | CellCountPerZoneRule
                | undefined
            )?.edges.some(
              e => e.x1 === tx && e.y1 === ty && e.x2 === cx && e.y2 === cy
            )
          ) {
            setGrid(
              grid.withRules(rules =>
                rules.map(r =>
                  r.id === cellCountPerZoneInstance.id
                    ? (r as CellCountPerZoneRule).withEdges(edges =>
                        edges.filter(
                          e =>
                            e.x1 !== tx ||
                            e.y1 !== ty ||
                            e.x2 !== cx ||
                            e.y2 !== cy
                        )
                      )
                    : r
                )
              )
            );
          }
        }
      }}
    />
  );
}

export default memo(function CellCountPerZoneTool() {
  return (
    <ToolboxItem
      id="cell_count_per_zone"
      order={18}
      name="Define zones"
      description="Left click a gap to add an edge. Right click to remove."
      hotkey="n"
      gridOverlay={<CellCountPerZoneToolOverlay />}
      onTileClick={null}
    >
      <TbFrame />
    </ToolboxItem>
  );
});

export const spec: PartSpec = {
  placement: PartPlacement.Toolbox,
  instructionId: cellCountPerZoneInstance.id,
};
