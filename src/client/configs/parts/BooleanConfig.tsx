import { memo } from 'react';
import { ConfigType, BooleanConfig } from '@logic-pad/core/data/config.js';
import Configurable from '@logic-pad/core/data/configurable.js';

export interface BooleanConfigProps {
  configurable: Configurable;
  config: BooleanConfig;
  setConfig?: (field: string, value: BooleanConfig['default']) => void;
}

// million-ignore
export default memo(function BooleanConfig({
  configurable,
  config,
  setConfig,
}: BooleanConfigProps) {
  const value = configurable[
    config.field as keyof typeof configurable
  ] as unknown as boolean;
  return (
    <div className="flex p-2 gap-4 justify-between items-center">
      <span>{config.description}</span>
      <input
        type="checkbox"
        className="toggle"
        checked={value}
        min="0"
        step="1"
        onChange={e => {
          setConfig?.(config.field, e.target.checked);
        }}
      />
    </div>
  );
});

export const type = ConfigType.Boolean;
