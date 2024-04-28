import { memo } from 'react';
import { ConfigType, NumberConfig } from '../../../data/config';
import Instruction from '../../../data/instruction';

export interface NumberConfigProps {
  instruction: Instruction;
  config: NumberConfig;
  setConfig?: (field: string, value: NumberConfig['default']) => void;
}

// million-ignore
export default memo(function NumberConfig({
  instruction,
  config,
  setConfig,
}: NumberConfigProps) {
  const value = instruction[
    config.field as keyof typeof instruction
  ] as unknown as number;
  return (
    <div className="flex p-2 gap-4 justify-between items-center">
      <span>{config.description}</span>
      <input
        type="number"
        className="input min-w-0 grow"
        value={value}
        min="0"
        step="1"
        onChange={e => {
          setConfig?.(config.field, Math.floor(Number(e.target.value)));
        }}
      />
    </div>
  );
});

export const type = ConfigType.Number;
