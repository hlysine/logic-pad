import { memo, useRef } from 'react';
import { ConfigType, GridConfig } from '@logic-pad/core/data/config';
import Configurable from '@logic-pad/core/data/configurable';
import GridData from '@logic-pad/core/data/grid';
import { FiExternalLink } from 'react-icons/fi';
import GridEditorModal, { GridEditorRef } from './GridEditorModal';

export interface GridConfigProps {
  configurable: Configurable;
  config: GridConfig;
  setConfig?: (field: string, value: GridConfig['default']) => void;
}

export default memo(function GridConfig({
  configurable,
  config,
  setConfig,
}: GridConfigProps) {
  const grid = configurable[
    config.field as keyof typeof configurable
  ] as unknown as GridData;
  const editorRef = useRef<GridEditorRef>(null);

  return (
    <div className="flex p-2 justify-between items-center">
      <span className="flex-1">{config.description}</span>
      <div className="flex flex-col gap-2">
        <button
          type="button"
          className="btn justify-start flex-nowrap flex"
          onClick={() => editorRef.current?.open(grid)}
        >
          Open editor
          <FiExternalLink size={24} />
        </button>

        <GridEditorModal
          ref={editorRef}
          onChange={grid => setConfig?.(config.field, grid)}
        />
      </div>
    </div>
  );
});

export const type = ConfigType.Grid;
