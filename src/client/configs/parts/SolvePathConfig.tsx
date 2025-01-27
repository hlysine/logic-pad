import { memo, useState } from 'react';
import { ConfigType, SolvePathConfig } from '@logic-pad/core/data/config';
import Configurable from '@logic-pad/core/data/configurable';
import { FiExternalLink } from 'react-icons/fi';
import { Position } from '@logic-pad/core/data/primitives';
import SolvePathEditorModal from './SolvePathEditorModal';

export interface SolvePathConfigProps {
  configurable: Configurable;
  config: SolvePathConfig;
  setConfig?: (field: string, value: SolvePathConfig['default']) => void;
}

export default memo(function SolvePathConfig({
  configurable,
  config,
  setConfig,
}: SolvePathConfigProps) {
  const solvePath = configurable[
    config.field as keyof typeof configurable
  ] as unknown as Position[];
  const [open, setOpen] = useState(false);

  return (
    <div className="flex p-2 justify-between items-center">
      <span className="flex-1">{config.description}</span>
      <div className="flex flex-col gap-2">
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
    </div>
  );
});

export const type = ConfigType.SolvePath;
