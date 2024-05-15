import { memo, useState } from 'react';
import { ConfigType, NullableGridConfig } from '../../../data/config';
import Configurable from '../../../data/configurable';
import GridData from '../../../data/grid';
import { FiExternalLink } from 'react-icons/fi';
import GridEditorModal from './GridEditorModal';
import { FaTrashCan } from 'react-icons/fa6';

export interface NullableGridConfigProps {
  configurable: Configurable;
  config: NullableGridConfig;
  setConfig?: (field: string, value: NullableGridConfig['default']) => void;
}

export default memo(function GridConfig({
  configurable,
  config,
  setConfig,
}: NullableGridConfigProps) {
  const grid = configurable[
    config.field as keyof typeof configurable
  ] as unknown as GridData | null;
  const [open, setOpen] = useState(false);

  return (
    <div className="flex p-2 justify-between items-center">
      <span className="flex-1">{config.description}</span>
      {grid === null ? (
        <button
          className="btn btn-sm"
          onClick={() => {
            setConfig?.(config.field, config.nonNullDefault);
          }}
        >
          Unset
        </button>
      ) : (
        <div className="flex gap-2 items-center">
          <div
            className="tooltip tooltip-info tooltip-top"
            data-tip="Clear value"
          >
            <button
              className="btn btn-sm"
              onClick={() => {
                setConfig?.(config.field, null);
              }}
            >
              <FaTrashCan />
            </button>
          </div>
          <button
            className="btn justify-start flex-nowrap flex"
            onClick={() => setOpen(true)}
          >
            Open editor
            <FiExternalLink size={24} />
          </button>

          <GridEditorModal
            grid={grid}
            setGrid={grid => setConfig?.(config.field, grid)}
            open={open}
            setOpen={setOpen}
          />
        </div>
      )}
    </div>
  );
});

export const type = ConfigType.NullableGrid;
