import { memo, useEffect, useRef, useState } from 'react';
import Symbol from '@logic-pad/core/data/symbols/symbol';
import ToolboxItem from './ToolboxItem';
import {
  getConfigurableLocation,
  useConfig,
} from '../contexts/ConfigContext.tsx';
import { useGrid } from '../contexts/GridContext.tsx';
import { Color, Position } from '@logic-pad/core/data/primitives';
import { eq, mousePosition } from '../../client/uiHelper.ts';
import PointerCaptureOverlay, {
  getPointerLocation,
} from '../grid/PointerCaptureOverlay';
import handleTileClick from '../grid/handleTileClick';
import { SymbolProps } from '../symbols';
import GridData from '@logic-pad/core/data/grid';

export interface SymbolToolProps {
  name: string;
  id?: string;
  hotkey?: string;
  sample: Symbol;
  component: React.NamedExoticComponent<SymbolProps<any>>;
  order?: number;
  defaultHidden?: boolean;
  onNewSymbol?: (symbol: Symbol, grid: GridData) => Symbol;
}

const SymbolToolOverlay = memo(function SymbolToolOverlay({
  sample,
  onNewSymbol,
}: SymbolToolProps) {
  const { setLocation, setRef } = useConfig();
  const { grid, setGrid } = useGrid();
  const [position, setPosition] = useState<Position | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!overlayRef.current) return;
    const pos = getPointerLocation(
      overlayRef.current,
      mousePosition.clientX,
      mousePosition.clientY,
      grid.width,
      grid.height,
      sample.placementStep,
      { top: 0, left: 0, bottom: 0, right: 0 }
    );
    if (pos.x < 0 || pos.y < 0 || pos.x > grid.width || pos.y > grid.height)
      return;
    setPosition(pos);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sample]);

  return (
    <PointerCaptureOverlay
      ref={overlayRef}
      width={grid.width}
      height={grid.height}
      allowDrag={false}
      step={sample.placementStep}
      colorMap={(x, y, color) => {
        if (color === Color.Dark)
          return !!grid.symbols
            .get(sample.id)
            ?.find(n => eq(n.x, x) && eq(n.y, y));
        return false;
      }}
      onTileClick={(x, y, from, to) => {
        if (from === Color.Dark) {
          setLocation(
            getConfigurableLocation(
              grid,
              grid.findSymbol(
                sym => sym.id === sample.id && eq(sym.x, x) && eq(sym.y, y)
              )!
            )
          );
          setRef({
            current: document
              .elementsFromPoint(mousePosition.clientX, mousePosition.clientY)
              .find(e => e.classList.contains('logic-tile')) as HTMLElement,
          });
        } else if (to === Color.Dark) {
          if (onNewSymbol) {
            setGrid(
              grid.addSymbol(onNewSymbol(sample.copyWith({ x, y }), grid))
            );
          } else {
            setGrid(grid.addSymbol(sample.copyWith({ x, y })));
          }
        }
      }}
      onPointerMove={(x, y) => setPosition({ x, y })}
      onPointerLeave={() => setPosition(null)}
    >
      {position && (
        <div
          className="absolute h-[1em] w-[1em] bg-transparent border-4 border-dashed border-accent rounded-[0.1em] pointer-events-none transition-all"
          style={{ left: `${position.x}em`, top: `${position.y}em` }}
        ></div>
      )}
    </PointerCaptureOverlay>
  );
});

export default memo(function SymbolTool(props: SymbolToolProps) {
  let {
    name,
    id,
    hotkey,
    sample,
    component: Component,
    order,
    defaultHidden,
  } = props;
  id = id ?? sample.id;
  return (
    <ToolboxItem
      id={id}
      name={name}
      description="Left click to place a symbol. Click again to configure it."
      order={order}
      hotkey={hotkey}
      defaultHidden={defaultHidden}
      gridOverlay={<SymbolToolOverlay {...props} />}
      onTileClick={(x, y, target, flood, gridContext) => {
        handleTileClick(x, y, target, flood, gridContext, true);
      }}
      className="text-[42px]"
    >
      <div className="absolute w-[1em] h-[1em]">
        <Component textClass="text-base-content" symbol={sample} />
      </div>
    </ToolboxItem>
  );
});
