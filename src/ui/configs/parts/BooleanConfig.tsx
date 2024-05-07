import { memo } from 'react';
import { ConfigType, BooleanConfig } from '../../../data/config';
import Instruction from '../../../data/instruction';

export interface BooleanConfigProps {
  instruction: Instruction;
  config: BooleanConfig;
  setConfig?: (field: string, value: BooleanConfig['default']) => void;
}

// million-ignore
export default memo(function BooleanConfig({
  instruction,
  config,
  setConfig,
}: BooleanConfigProps) {
  const value = instruction[
    config.field as keyof typeof instruction
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
