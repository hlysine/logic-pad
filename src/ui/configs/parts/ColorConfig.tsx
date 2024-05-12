import { memo } from 'react';
import { ColorConfig, ConfigType } from '../../../data/config';
import { Color } from '../../../data/primitives';
import { cn } from '../../../utils';
import Configurable from '../../../data/configurable';

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
    <div className="flex p-2 justify-between items-center">
      <span>{config.description}</span>
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
    </div>
  );
});

export const type = ConfigType.Color;
