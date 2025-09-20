import { memo } from 'react';
import { ColorConfig, ConfigType } from '@logic-pad/core/data/config';
import { Color } from '@logic-pad/core/data/primitives';
import { cn } from '../../../client/uiHelper.ts';
import Configurable from '@logic-pad/core/data/configurable';
import ConfigItem from './ConfigItem.tsx';

export interface ColorConfigProps {
  configurable: Configurable;
  config: ColorConfig;
  setConfig?: (field: string, value: ColorConfig['default']) => void;
}

// million-ignore
const ColorRadio = memo(function ColorRadio({
  value,
  setValue,
  color,
}: {
  value: Color;
  setValue: (value: Color) => void;
  color: Color;
}) {
  return (
    <input
      type="radio"
      name="radio-dark"
      className={cn(
        'appearance-none w-8 h-8 rounded checked:shadow-glow-md checked:shadow-accent checked:border-2 checked:border-accent',
        {
          'bg-gray-500': color === Color.Gray,
          'bg-white': color === Color.Light,
          'bg-black': color === Color.Dark,
        }
      )}
      value={color}
      checked={value === color}
      onChange={e => {
        setValue(e.target.value as Color);
      }}
    />
  );
});

// million-ignore
export default memo(function ColorConfig({
  configurable,
  config,
  setConfig,
}: ColorConfigProps) {
  const value = configurable[
    config.field as keyof typeof configurable
  ] as unknown as Color;
  return (
    <ConfigItem config={config}>
      <div className="flex gap-4">
        <ColorRadio
          value={value}
          setValue={value => setConfig?.(config.field, value)}
          color={Color.Dark}
        />
        {config.allowGray && (
          <ColorRadio
            value={value}
            setValue={value => setConfig?.(config.field, value)}
            color={Color.Gray}
          />
        )}
        <ColorRadio
          value={value}
          setValue={value => setConfig?.(config.field, value)}
          color={Color.Light}
        />
      </div>
    </ConfigItem>
  );
});

export const type = ConfigType.Color;
