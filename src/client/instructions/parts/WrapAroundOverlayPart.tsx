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
import { cn } from '../../uiHelper.ts';
import SymbolOverlay from '../../grid/SymbolOverlay.tsx';
import GridZoneOverlay from '../../grid/GridZoneOverlay.tsx';
import { useSettings } from '../../contexts/SettingsContext.tsx';

interface WrapAroundOverlayPartProps {
  instruction: WrapAroundRule;
}

function getLeftEdge(grid: GridData) {
  return grid.copyWith({
    width: 1,
    tiles: array(1, grid.height, (_, y) => grid.getTile(grid.width - 1, y)),
    connections: new GridConnections(
      grid.connections.edges
        .filter(e => e.x1 === grid.width - 1 || e.x2 === grid.width - 1)
        .map(e => ({
          x1: e.x1 - grid.width + 1,
          y1: e.y1,
          x2: e.x2 - grid.width + 1,
          y2: e.y2,
        }))
    ),
    symbols: new Map(
      [...grid.symbols.entries()].map(([k, v]) => [
        k,
        v
          .filter(s => Math.abs(s.x - grid.width + 1) < 0.5)
          .map(s => s.withX(s.x - grid.width + 1)),
      ])
    ),
    rules: [],
    zones: new GridZones(
      grid.zones.edges
        .filter(e => e.x1 === grid.width - 1 || e.x2 === grid.width - 1)
        .map(e => ({
          x1: e.x1 - grid.width + 1,
          y1: e.y1,
          x2: e.x2 - grid.width + 1,
          y2: e.y2,
        }))
    ),
  });
}

function getRightEdge(grid: GridData) {
  return grid.copyWith({
    width: 1,
    tiles: array(1, grid.height, (_, y) => grid.getTile(0, y)),
    connections: new GridConnections(
      grid.connections.edges.filter(e => e.x1 === 0 || e.x2 === 0)
    ),
    symbols: new Map(
      [...grid.symbols.entries()].map(([k, v]) => [
        k,
        v.filter(s => Math.abs(s.x) < 0.5),
      ])
    ),
    rules: [],
    zones: new GridZones(
      grid.zones.edges.filter(e => e.x1 === 0 || e.x2 === 0)
    ),
  });
}

function getTopEdge(grid: GridData) {
  return grid.copyWith({
    height: 1,
    tiles: array(grid.width, 1, (x, _) => grid.getTile(x, grid.height - 1)),
    connections: new GridConnections(
      grid.connections.edges
        .filter(e => e.y1 === grid.height - 1 || e.y1 === grid.height - 1)
        .map(e => ({
          x1: e.x1,
          y1: e.y1 - grid.height + 1,
          x2: e.x2,
          y2: e.y2 - grid.height + 1,
        }))
    ),
    symbols: new Map(
      [...grid.symbols.entries()].map(([k, v]) => [
        k,
        v
          .filter(s => Math.abs(s.y - grid.height + 1) < 0.5)
          .map(s => s.withY(s.y - grid.height + 1)),
      ])
    ),
    rules: [],
    zones: new GridZones(
      grid.zones.edges
        .filter(e => e.y1 === grid.height - 1 || e.y1 === grid.height - 1)
        .map(e => ({
          x1: e.x1,
          y1: e.y1 - grid.height + 1,
          x2: e.x2,
          y2: e.y2 - grid.height + 1,
        }))
    ),
  });
}

function getBottomEdge(grid: GridData) {
  return grid.copyWith({
    height: 1,
    tiles: array(grid.width, 1, (x, _) => grid.getTile(x, 0)),
    connections: new GridConnections(
      grid.connections.edges.filter(e => e.y1 === 0 || e.y1 === 0)
    ),
    symbols: new Map(
      [...grid.symbols.entries()].map(([k, v]) => [
        k,
        v.filter(s => Math.abs(s.y) < 0.5),
      ])
    ),
    rules: [],
    zones: new GridZones(
      grid.zones.edges.filter(e => e.y1 === 0 || e.y1 === 0)
    ),
  });
}

export default memo(function WrapAroundOverlayPart({
  instruction,
}: WrapAroundOverlayPartProps) {
  const { grid } = useGrid();
  const { scale, responsiveScale } = useDisplay();
  const [visualizeWrapArounds] = useSettings('visualizeWrapArounds');
  const leftGrid = useMemo(() => {
    if (instruction.horizontal === Wrapping.None) return grid;
    return instruction.horizontal === Wrapping.Wrap ||
      instruction.horizontal === Wrapping.WrapReverse
      ? getLeftEdge(grid)
      : getRightEdge(grid);
  }, [grid, instruction]);
  const rightGrid = useMemo(() => {
    if (instruction.horizontal === Wrapping.None) return grid;
    return instruction.horizontal === Wrapping.Wrap ||
      instruction.horizontal === Wrapping.WrapReverse
      ? getRightEdge(grid)
      : getLeftEdge(grid);
  }, [grid, instruction]);
  const topGrid = useMemo(() => {
    if (instruction.vertical === Wrapping.None) return grid;
    return instruction.vertical === Wrapping.Wrap ||
      instruction.vertical === Wrapping.WrapReverse
      ? getTopEdge(grid)
      : getBottomEdge(grid);
  }, [grid, instruction]);
  const bottomGrid = useMemo(() => {
    if (instruction.vertical === Wrapping.None) return grid;
    return instruction.vertical === Wrapping.Wrap ||
      instruction.vertical === Wrapping.WrapReverse
      ? getBottomEdge(grid)
      : getTopEdge(grid);
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
        tileSize: computeTileSize(grid, responsiveScale),
      });
    window.addEventListener('resize', resizeHandler);
    resizeHandler();
    return () => {
      window.removeEventListener('resize', resizeHandler);
    };
  }, [grid, responsiveScale]);
  if (!visualizeWrapArounds) return null;
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
            className={cn(
              'absolute right-full',
              (instruction.horizontal === Wrapping.WrapReverse ||
                instruction.horizontal === Wrapping.ReflectReverse) &&
                '-scale-y-100',
              instruction.horizontal === Wrapping.ReflectReverse
                ? '-scale-x-100 mask-fade-r'
                : 'mask-fade-l'
            )}
          >
            <SymbolOverlay grid={leftGrid} solution={null} editable={false} />
            <GridZoneOverlay grid={leftGrid} />
          </Grid>
          <Grid
            grid={rightGrid}
            size={Math.round(tileConfig.tileSize * scale)}
            editable={false}
            className={cn(
              'absolute left-full',
              (instruction.horizontal === Wrapping.WrapReverse ||
                instruction.horizontal === Wrapping.ReflectReverse) &&
                '-scale-y-100',
              instruction.horizontal === Wrapping.ReflectReverse
                ? '-scale-x-100 mask-fade-l'
                : 'mask-fade-r'
            )}
          >
            <SymbolOverlay grid={rightGrid} solution={null} editable={false} />
            <GridZoneOverlay grid={rightGrid} />
          </Grid>
        </>
      )}
      {instruction.vertical !== Wrapping.None && (
        <>
          <Grid
            grid={topGrid}
            size={Math.round(tileConfig.tileSize * scale)}
            editable={false}
            className={cn(
              'absolute bottom-full',
              (instruction.vertical === Wrapping.WrapReverse ||
                instruction.vertical === Wrapping.ReflectReverse) &&
                '-scale-x-100',
              instruction.vertical === Wrapping.ReflectReverse
                ? '-scale-y-100 mask-fade-b'
                : 'mask-fade-t'
            )}
          >
            <SymbolOverlay grid={topGrid} solution={null} editable={false} />
            <GridZoneOverlay grid={topGrid} />
          </Grid>
          <Grid
            grid={bottomGrid}
            size={Math.round(tileConfig.tileSize * scale)}
            editable={false}
            className={cn(
              'absolute top-full',
              (instruction.vertical === Wrapping.WrapReverse ||
                instruction.vertical === Wrapping.ReflectReverse) &&
                '-scale-x-100',
              instruction.vertical === Wrapping.ReflectReverse
                ? '-scale-y-100 mask-fade-t'
                : 'mask-fade-b'
            )}
          >
            <SymbolOverlay grid={bottomGrid} solution={null} editable={false} />
            <GridZoneOverlay grid={bottomGrid} />
          </Grid>
        </>
      )}
    </GridOverlay>
  );
});

export const spec: PartSpec = {
  placement: PartPlacement.MainGridOverlay,
  instructionId: wrapAroundInstance.id,
};
