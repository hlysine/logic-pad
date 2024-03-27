import { memo } from 'react';
import { StringConfig } from '../../data/config';
import Instruction from '../../data/instruction';

export interface StringConfigProps {
  instruction: Instruction;
  config: StringConfig;
  setConfig?: (field: string, value: StringConfig['default']) => void;
}

// million-ignore
export default memo(function StringConfig({
  instruction,
  config,
  setConfig,
}: StringConfigProps) {
  const value = instruction[config.field as keyof typeof instruction] as string;
  return (
    <div className="flex p-2 gap-4 justify-between items-center">
      <span className="text-lg">{config.description}</span>
      <input
        type="text"
        placeholder="Enter description. Emphasize with *asterisks*."
        className="input input-secondary focus:border-accent bg-opacity-10 text-secondary-content placeholder-secondary-content/30 min-w-0 grow"
        value={value}
        onChange={e => {
          setConfig?.(config.field, e.target.value);
        }}
      />
    </div>
  );
});
