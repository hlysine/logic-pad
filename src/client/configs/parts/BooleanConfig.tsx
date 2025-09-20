import { memo } from 'react';
import { ConfigType, BooleanConfig } from '@logic-pad/core/data/config';
import Configurable from '@logic-pad/core/data/configurable';
import ConfigItem from './ConfigItem';

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
    <ConfigItem config={config}>
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
    </ConfigItem>
  );
});

export const type = ConfigType.Boolean;
