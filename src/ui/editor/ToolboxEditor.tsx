import { memo, useEffect } from 'react';
import { useToolbox } from '../ToolboxContext';
import { allTools } from './tools';
import { cn } from '../../utils';
import GridSizeEditor from './GridSizeEditor';
import { GridConsumer } from '../GridContext';

export default memo(function ToolboxEditor() {
  const { name, description, setTool } = useToolbox();

  useEffect(() => {
    setTool(null, null, null, null, null);
    return () => setTool(null, null, null, null, null);
  }, [setTool]);

  return (
    <div className="flex flex-col gap-2">
      <GridConsumer>
        {({ grid, setGrid }) => (
          <GridSizeEditor grid={grid} setGrid={setGrid} />
        )}
      </GridConsumer>
      <span className="divider mt-0 mb-0"></span>
      <div className="flex flex-col gap-2">
        <span className="text-sm font-bold">{name ?? 'No tool selected'}</span>
        <span
          className={cn(
            'inline-block text-sm h-0 transition-[height]',
            description && 'h-[2.5em]'
          )}
        >
          {description}
        </span>
      </div>
      <span className="divider mt-0 mb-0"></span>
      <div className="flex flex-wrap gap-2 justify-center">
        {allTools.map((Tool, i) => (
          <Tool key={i} />
        ))}
      </div>
    </div>
  );
});
