import { memo } from 'react';
import { ConfigType, NumberConfig } from '../../../data/config';
import Configurable from '../../../data/configurable';

export interface NumberConfigProps {
  configurable: Configurable;
  config: NumberConfig;
  setConfig?: (field: string, value: NumberConfig['default']) => void;
}

// million-ignore
export default memo(function NumberConfig({
  configurable,
  config,
  setConfig,
}: NumberConfigProps) {
  const value = configurable[
    config.field as keyof typeof configurable
  ] as unknown as number;
  return (
    <div className="flex p-2 gap-4 justify-between items-center">
      <span>{config.description}</span>
      <input
        type="number"
        className="input min-w-0 grow"
        value={value}
        min={config.min}
        max={config.max}
        step="1"
        onChange={e => {
          setConfig?.(config.field, Math.floor(Number(e.target.value)));
        }}
      />
    </div>
  );
});

export const type = ConfigType.Number;
