import { memo } from 'react';
import { ConfigType, TileConfig } from '@logic-pad/core/data/config';
import Configurable from '@logic-pad/core/data/configurable';
import { Color } from '@logic-pad/core/data/primitives';
import Grid from '../../grid/Grid';
import GridData from '@logic-pad/core/data/grid';
import GridSizeEditor from '../../editor/GridSizeEditor';

export interface TileConfigProps {
  configurable: Configurable;
  config: TileConfig;
  setConfig?: (field: string, value: TileConfig['default']) => void;
}

export default memo(function TileConfig({
  configurable,
  config,
  setConfig,
}: TileConfigProps) {
  const grid = configurable[
    config.field as keyof typeof configurable
  ] as unknown as GridData;
  return (
    <div className="flex p-2 justify-between items-center">
      <span className="flex-1">{config.description}</span>
      <div className="flex flex-col flex-[2] gap-2">
        {config.resizable && (
          <GridSizeEditor
            size="xs"
            grid={grid}
            setGrid={setConfig?.bind(null, config.field) ?? (() => {})}
          />
        )}
        <Grid
          type="canvas"
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
                grid.floodFillAll(Color.Gray, tile.color, false)
              );
            } else if (flood && !tile.fixed) {
              setConfig?.(
                config.field,
                grid.floodFill({ x, y }, Color.Gray, target, false)
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

export const type = ConfigType.Tile;
