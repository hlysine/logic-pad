import { memo, useRef } from 'react';
import { ConfigType, SolvePathConfig } from '@logic-pad/core/data/config';
import Configurable from '@logic-pad/core/data/configurable';
import { FiExternalLink } from 'react-icons/fi';
import { Position } from '@logic-pad/core/data/primitives';
import SolvePathEditorModal, {
  SolvePathEditorRef,
} from './SolvePathEditorModal';
import { useGrid } from '../../contexts/GridContext';

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
  const { grid, metadata } = useGrid();
  const solvePath = configurable[
    config.field as keyof typeof configurable
  ] as unknown as Position[];

  const editorRef = useRef<SolvePathEditorRef>(null);

  return (
    <div className="flex p-2 justify-between items-center">
      <span className="flex-1">{config.description}</span>
      <div className="flex flex-col gap-2">
        <button
          type="button"
          className="btn justify-start flex-nowrap flex"
          onClick={() => editorRef.current?.open(solvePath, grid, metadata)}
        >
          Open editor
          <FiExternalLink size={24} />
        </button>

        <SolvePathEditorModal
          ref={editorRef}
          onChange={solvePath => setConfig?.(config.field, solvePath)}
        />
      </div>
    </div>
  );
});

export const type = ConfigType.SolvePath;
