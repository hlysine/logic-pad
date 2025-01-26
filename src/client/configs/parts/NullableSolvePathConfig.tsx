import { memo, useState } from 'react';
import {
  ConfigType,
  NullableSolvePathConfig,
} from '@logic-pad/core/data/config';
import Configurable from '@logic-pad/core/data/configurable';
import { FiExternalLink } from 'react-icons/fi';
import { FaTrashCan } from 'react-icons/fa6';
import { Position } from '@logic-pad/core/data/primitives';
import SolvePathEditorModal from './SolvePathEditorModal';

export interface NullableSolvePathConfigProps {
  configurable: Configurable;
  config: NullableSolvePathConfig;
  setConfig?: (
    field: string,
    value: NullableSolvePathConfig['default']
  ) => void;
}

export default memo(function NullableSolvePathConfig({
  configurable,
  config,
  setConfig,
}: NullableSolvePathConfigProps) {
  const solvePath = configurable[
    config.field as keyof typeof configurable
  ] as unknown as Position[] | null;
  const [open, setOpen] = useState(false);

  return (
    <div className="flex p-2 justify-between items-center">
      <span className="flex-1">{config.description}</span>
      {solvePath === null ? (
        <button
          type="button"
          className="btn btn-sm"
          onClick={() => {
            setConfig?.(config.field, []);
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
              type="button"
              aria-label="Clear value"
              className="btn btn-sm"
              onClick={() => {
                setConfig?.(config.field, null);
              }}
            >
              <FaTrashCan />
            </button>
          </div>
          <button
            type="button"
            className="btn justify-start flex-nowrap flex"
            onClick={() => setOpen(true)}
          >
            Open editor
            <FiExternalLink size={24} />
          </button>

          <SolvePathEditorModal
            solvePath={solvePath}
            setSolvePath={solvePath => setConfig?.(config.field, solvePath)}
            open={open}
            setOpen={setOpen}
          />
        </div>
      )}
    </div>
  );
});

export const type = ConfigType.NullableSolvePath;
