import { memo } from 'react';
import { ConfigType, WrappingConfig } from '@logic-pad/core/data/config';
import Configurable from '@logic-pad/core/data/configurable';
import { WRAPPINGS, Wrapping } from '@logic-pad/core/data/primitives';
import ConfigItem from './ConfigItem';

export interface WrappingConfigProps {
  configurable: Configurable;
  config: WrappingConfig;
  setConfig?: (field: string, value: WrappingConfig['default']) => void;
}

function getDisplayName(wrapping: Wrapping) {
  switch (wrapping) {
    case Wrapping.None:
      return 'None';
    case Wrapping.Wrap:
      return 'Wrap';
    case Wrapping.WrapReverse:
      return 'Reversed wrap';
    case Wrapping.ReflectReverse:
      return 'Reversed reflect';
  }
}

// million-ignore
export default memo(function WrappingConfig({
  configurable,
  config,
  setConfig,
}: WrappingConfigProps) {
  const value = configurable[
    config.field as keyof typeof configurable
  ] as unknown as Wrapping;
  return (
    <ConfigItem config={config}>
      <select
        className="select select-bordered w-36"
        value={value}
        onChange={e =>
          setConfig?.(config.field, e.currentTarget.value as Wrapping)
        }
      >
        {WRAPPINGS.map(c => (
          <option key={c} value={c}>
            {getDisplayName(c)}
          </option>
        ))}
      </select>
    </ConfigItem>
  );
});

export const type = ConfigType.Wrapping;
