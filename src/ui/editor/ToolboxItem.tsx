import { memo, useEffect } from 'react';
import { useToolbox } from '../ToolboxContext';
import { cn } from '../../utils';
import { Color } from '../../data/primitives';
import { GridContext } from '../GridContext';
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
    >
      <button
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
