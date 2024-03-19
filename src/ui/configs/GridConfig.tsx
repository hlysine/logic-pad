import { memo } from 'react';
import { GridConfig } from '../../data/config';
import Instruction from '../../data/instruction';
import { Color } from '../../data/primitives';
import Grid from '../grid/Grid';
import GridData from '../../data/grid';

export interface GridConfigProps {
  instruction: Instruction;
  config: GridConfig;
  setConfig?: (field: string, value: GridConfig['default']) => void;
}

export default memo(function GridConfig({
  instruction,
  config,
  setConfig,
}: GridConfigProps) {
  const grid = instruction[
    config.field as keyof typeof instruction
  ] as unknown as GridData;
  return (
    <div className="flex p-2 justify-between items-center">
      <span className="text-lg">{config.description}</span>
      <Grid
        size={20}
        grid={grid}
        editable={true}
        onTileClick={(x, y, target, flood) => {
          const tile = grid.getTile(x, y);
          if (flood && target === Color.Gray) {
            // target is Color.Gray if the tile is already the target color
            setConfig?.(
              config.field,
              grid.floodFillAll(Color.Gray, tile.color)
            );
          } else if (flood && !tile.fixed) {
            setConfig?.(
              config.field,
              grid.floodFill({ x, y }, Color.Gray, target)
            );
          } else if (!tile.fixed) {
            setConfig?.(
              config.field,
              grid.setTile(x, y, t => t.withColor(target))
            );
          }
        }}
      ></Grid>
    </div>
  );
});
