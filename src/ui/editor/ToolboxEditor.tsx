import { memo, useEffect } from 'react';
import { useToolbox } from '../ToolboxContext';
import { allTools } from './tools';
import { cn } from '../../utils';

export default memo(function ToolboxEditor() {
  const { name, description, setTool } = useToolbox();

  useEffect(() => {
    setTool(null, null, null, null, null);
    return () => setTool(null, null, null, null, null);
  }, [setTool]);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-2">
        <span className="text-sm font-bold">{name ?? 'No tool selected'}</span>
        <span
          className={cn(
            'inline-block text-sm h-0 transition-[height]',
            description && 'h-[60px]'
          )}
        >
          {description}
        </span>
        <span className="divider mt-0 mb-0"></span>
      </div>
      <div className="flex flex-wrap gap-2">
        {allTools.map((Tool, i) => (
          <Tool key={i} />
        ))}
      </div>
    </div>
  );
});
