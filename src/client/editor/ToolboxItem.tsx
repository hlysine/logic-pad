import { memo, useEffect } from 'react';
import { useToolbox } from '../contexts/ToolboxContext.tsx';
import { cn } from '../../client/uiHelper.ts';
import { Color } from '@logic-pad/core/data/primitives.js';
import { GridContext } from '../contexts/GridContext.tsx';
import { useHotkeys } from 'react-hotkeys-hook';

export interface ToolboxItemProps {
  id: string;
  name: string;
  description: string;
  gridOverlay: React.ReactNode;
  onTileClick:
    | ((
        x: number,
        y: number,
        target: Color,
        flood: boolean,
        gridContext: GridContext
      ) => void)
    | null;
  children: React.ReactNode;
  className?: string;
  hotkey?: string;
  order?: number;
}

export default memo(function ToolboxItem({
  id,
  name,
  description,
  gridOverlay,
  onTileClick,
  children,
  className,
  hotkey,
  order,
}: ToolboxItemProps) {
  const { toolId, setTool } = useToolbox();

  useEffect(() => {
    if (toolId === id) {
      setTool(id, name, description, gridOverlay, onTileClick);
    }
  }, [id, name, description, gridOverlay, onTileClick, setTool, toolId]);

  useHotkeys(
    hotkey ?? [],
    () => setTool(id, name, description, gridOverlay, onTileClick),
    {
      preventDefault: true,
      keydown: hotkey !== undefined,
      keyup: false,
    }
  );

  return (
    <div
      className="tooltip tooltip-info"
      data-tip={name + (hotkey ? ` (${hotkey})` : '')}
      style={{ order }}
    >
      <button
        type="button"
        aria-label={name}
        className={cn(
          'btn text-xl p-0 w-12',
          toolId === id && 'btn-primary',
          className
        )}
        onClick={() => setTool(id, name, description, gridOverlay, onTileClick)}
      >
        {children}
      </button>
    </div>
  );
});
