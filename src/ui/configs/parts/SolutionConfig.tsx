import { memo, useEffect, useMemo } from 'react';
import { ConfigType, SolutionConfig } from '../../../data/config';
import Instruction from '../../../data/instruction';
import { Color } from '../../../data/primitives';
import Grid from '../../grid/Grid';
import GridData from '../../../data/grid';
import { useGrid } from '../../GridContext';
import MysteryRule from '../../../data/rules/mysteryRule';

export interface SolutionConfigProps {
  instruction: Instruction;
  config: SolutionConfig;
  setConfig?: (field: string, value: SolutionConfig['default']) => void;
}

export default memo(function SolutionConfig({
  instruction,
  config,
  setConfig,
}: SolutionConfigProps) {
  const { grid: baseGrid } = useGrid();
  const solution = instruction[
    config.field as keyof typeof instruction
  ] as unknown as GridData;
  const grid = useMemo(() => {
    return MysteryRule.cleanSolution(solution, baseGrid);
  }, [baseGrid, solution]);
  useEffect(() => {
    if (!grid.equals(solution)) {
      setConfig?.(config.field, grid);
    }
  }, [baseGrid, config.field, grid, setConfig, solution]);
  return (
    <div className="flex p-2 justify-between items-center">
      <span className="flex-1">{config.description}</span>
      <div className="flex flex-col flex-[2] gap-2">
        <Grid
          size={Math.min(25, (10 * 25) / grid.width)}
          grid={grid}
          editable={true}
          className="self-center"
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
    </div>
  );
});

export const type = ConfigType.Solution;
