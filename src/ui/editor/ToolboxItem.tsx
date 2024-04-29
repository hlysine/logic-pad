import { memo, useEffect } from 'react';
import { useToolbox } from '../ToolboxContext';
import { cn } from '../../utils';
import { Color } from '../../data/primitives';
import { GridContext } from '../GridContext';

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
}

export default memo(function ToolboxItem({
  id,
  name,
  description,
  gridOverlay,
  onTileClick,
  children,
}: ToolboxItemProps) {
  const { toolId, setTool } = useToolbox();

  useEffect(() => {
    if (toolId === id) {
      setTool(id, name, description, gridOverlay, onTileClick);
    }
  }, [id, name, description, gridOverlay, onTileClick, setTool, toolId]);

  return (
    <div className="tooltip tooltip-info" data-tip={name}>
      <button
        className={cn('btn text-xl py-0', toolId === id && 'btn-primary')}
        onClick={() => setTool(id, name, description, gridOverlay, onTileClick)}
      >
        {children}
      </button>
    </div>
  );
});
