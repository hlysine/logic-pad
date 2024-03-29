import { memo } from 'react';
import { NumberConfig } from '../../data/config';
import Instruction from '../../data/instruction';

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
      <span className="text-lg">{config.description}</span>
      <input
        type="number"
        className="input input-secondary focus:border-accent bg-opacity-10 text-secondary-content placeholder-secondary-content/30 min-w-0 grow"
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
