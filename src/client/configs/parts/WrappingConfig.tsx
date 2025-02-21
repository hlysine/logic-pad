import { memo } from 'react';
import { ConfigType, WrappingConfig } from '@logic-pad/core/data/config';
import Configurable from '@logic-pad/core/data/configurable';
import { WRAPPINGS, Wrapping } from '@logic-pad/core/data/primitives';

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
    case Wrapping.Reflect:
      return 'Reflect';
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
    <div className="flex p-2 gap-4 justify-between items-center">
      <span>{config.description}</span>
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
    </div>
  );
});

export const type = ConfigType.Wrapping;
