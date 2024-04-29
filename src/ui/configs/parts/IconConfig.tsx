import { memo } from 'react';
import { ConfigType, IconConfig } from '../../../data/config';
import Instruction from '../../../data/instruction';
import { IconString } from '../../../data/symbols/customIconSymbol';
import Autocomplete from '../../components/Autocomplete';

export interface IconConfigProps {
  instruction: Instruction;
  config: IconConfig;
  setConfig?: (field: string, value: IconConfig['default']) => void;
}

const Md = await import('react-icons/md');
const iconNames = Object.keys(Md).filter(key => key !== 'default');

// million-ignore
export default memo(function IconConfig({
  instruction,
  config,
  setConfig,
}: IconConfigProps) {
  const value = instruction[
    config.field as keyof typeof instruction
  ] as unknown as IconString;
  return (
    <div className="flex p-2 gap-4 justify-between items-center">
      <span>{config.description}</span>
      <Autocomplete
        className="grow"
        items={iconNames}
        value={value}
        onChange={e => {
          setConfig?.(config.field, e);
        }}
      />
    </div>
  );
});

export const type = ConfigType.Icon;
