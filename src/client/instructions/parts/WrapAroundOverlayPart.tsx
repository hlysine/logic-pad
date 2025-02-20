import { PartPlacement, PartSpec } from './types.ts';
import { memo, useEffect, useMemo, useState } from 'react';
import WrapAroundRule, {
  instance as wrapAroundInstance,
} from '@logic-pad/core/data/rules/wrapAroundRule';
import GridOverlay from '../../grid/GridOverlay.tsx';
import { useGrid } from '../../contexts/GridContext.tsx';
import Grid from '../../grid/Grid.tsx';
import { computeTileSize } from '../../grid/MainGrid.tsx';
import { useDisplay } from '../../contexts/DisplayContext.tsx';
import { array } from '@logic-pad/core/data/dataHelper';
import GridZones from '@logic-pad/core/data/gridZones';
import GridData from '@logic-pad/core/data/grid';
import { Wrapping } from '@logic-pad/core/data/primitives';
import GridConnections from '@logic-pad/core/data/gridConnections';

export interface WrapAroundOverlayPartProps {
  instruction: WrapAroundRule;
}

function getLeftEdge(grid: GridData, reverse: boolean) {
  return grid.copyWith({
    width: 1,
    tiles: array(1, grid.height, (_, y) =>
      grid.getTile(grid.width - 1, reverse ? grid.height - 1 - y : y)
    ),
    connections: new GridConnections(
      grid.connections.edges
        .filter(e => e.x1 === grid.width - 1 || e.x2 === grid.width - 1)
        .map(e => ({
          x1: e.x1 - grid.width + 1,
          y1: reverse ? grid.height - 1 - e.y1 : e.y1,
          x2: e.x2 - grid.width + 1,
          y2: reverse ? grid.height - 1 - e.y2 : e.y2,
        }))
    ),
    symbols: new Map(),
    rules: [],
    zones: new GridZones(),
  });
}

function getRightEdge(grid: GridData, reverse: boolean) {
  return grid.copyWith({
    width: 1,
    tiles: array(1, grid.height, (_, y) =>
      grid.getTile(0, reverse ? grid.height - 1 - y : y)
    ),
    connections: new GridConnections(
      grid.connections.edges.filter(e => e.x1 === 0 || e.x2 === 0)
    ),
    symbols: new Map(),
    rules: [],
    zones: new GridZones(),
  });
}

function getTopEdge(grid: GridData, reverse: boolean) {
  return grid.copyWith({
    height: 1,
    tiles: array(grid.width, 1, (x, _) =>
      grid.getTile(reverse ? grid.width - 1 - x : x, grid.height - 1)
    ),
    connections: new GridConnections(
      grid.connections.edges
        .filter(e => e.y1 === grid.height - 1 || e.y1 === grid.height - 1)
        .map(e => ({
          x1: reverse ? grid.width - 1 - e.x1 : e.x1,
          y1: e.y1 - grid.height + 1,
          x2: reverse ? grid.width - 1 - e.x2 : e.x2,
          y2: e.y2 - grid.height + 1,
        }))
    ),
    symbols: new Map(),
    rules: [],
    zones: new GridZones(),
  });
}

function getBottomEdge(grid: GridData, reverse: boolean) {
  return grid.copyWith({
    height: 1,
    tiles: array(grid.width, 1, (x, _) =>
      grid.getTile(reverse ? grid.width - 1 - x : x, 0)
    ),
    connections: new GridConnections(
      grid.connections.edges.filter(e => e.y1 === 0 || e.y1 === 0)
    ),
    symbols: new Map(),
    rules: [],
    zones: new GridZones(),
  });
}

export default memo(function WrapAroundOverlayPart({
  instruction,
}: WrapAroundOverlayPartProps) {
  const { grid } = useGrid();
  const { scale } = useDisplay();
  const leftGrid = useMemo(() => {
    if (instruction.horizontal === Wrapping.None) return grid;
    const reverse =
      instruction.horizontal === Wrapping.WrapReverse ||
      instruction.horizontal === Wrapping.ReflectReverse;
    return instruction.horizontal === Wrapping.Wrap ||
      instruction.horizontal === Wrapping.WrapReverse
      ? getLeftEdge(grid, reverse)
      : getRightEdge(grid, reverse);
  }, [grid, instruction]);
  const rightGrid = useMemo(() => {
    if (instruction.horizontal === Wrapping.None) return grid;
    const reverse =
      instruction.horizontal === Wrapping.WrapReverse ||
      instruction.horizontal === Wrapping.ReflectReverse;
    return instruction.horizontal === Wrapping.Wrap ||
      instruction.horizontal === Wrapping.WrapReverse
      ? getRightEdge(grid, reverse)
      : getLeftEdge(grid, reverse);
  }, [grid, instruction]);
  const topGrid = useMemo(() => {
    if (instruction.vertical === Wrapping.None) return grid;
    const reverse =
      instruction.vertical === Wrapping.WrapReverse ||
      instruction.vertical === Wrapping.ReflectReverse;
    return instruction.vertical === Wrapping.Wrap ||
      instruction.vertical === Wrapping.WrapReverse
      ? getTopEdge(grid, reverse)
      : getBottomEdge(grid, reverse);
  }, [grid, instruction]);
  const bottomGrid = useMemo(() => {
    if (instruction.vertical === Wrapping.None) return grid;
    const reverse =
      instruction.vertical === Wrapping.WrapReverse ||
      instruction.vertical === Wrapping.ReflectReverse;
    return instruction.vertical === Wrapping.Wrap ||
      instruction.vertical === Wrapping.WrapReverse
      ? getBottomEdge(grid, reverse)
      : getTopEdge(grid, reverse);
  }, [grid, instruction]);

  const [tileConfig, setTileConfig] = useState<{
    width: number;
    height: number;
    tileSize: number;
  }>({ width: 0, height: 0, tileSize: 0 });
  useEffect(() => {
    const resizeHandler = () =>
      setTileConfig({
        width: grid.width,
        height: grid.height,
        tileSize: computeTileSize(grid),
      });
    window.addEventListener('resize', resizeHandler);
    resizeHandler();
    return () => {
      window.removeEventListener('resize', resizeHandler);
    };
  }, [grid]);
  if (
    tileConfig.tileSize === 0 ||
    tileConfig.width !== grid.width ||
    tileConfig.height !== grid.height
  )
    return null;

  return (
    <GridOverlay>
      {instruction.horizontal !== Wrapping.None && (
        <>
          <Grid
            grid={leftGrid}
            size={Math.round(tileConfig.tileSize * scale)}
            editable={false}
            className="absolute right-full mask-fade-l"
          />
          <Grid
            grid={rightGrid}
            size={Math.round(tileConfig.tileSize * scale)}
            editable={false}
            className="absolute left-full mask-fade-r"
          />
        </>
      )}
      {instruction.vertical !== Wrapping.None && (
        <>
          <Grid
            grid={topGrid}
            size={Math.round(tileConfig.tileSize * scale)}
            editable={false}
            className="absolute bottom-full mask-fade-t"
          />
          <Grid
            grid={bottomGrid}
            size={Math.round(tileConfig.tileSize * scale)}
            editable={false}
            className="absolute top-full mask-fade-b"
          />
        </>
      )}
    </GridOverlay>
  );
});

export const spec: PartSpec = {
  placement: PartPlacement.MainGridOverlay,
  instructionId: wrapAroundInstance.id,
};
