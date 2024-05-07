import { memo, useEffect, useState } from 'react';
import { ConfigType, IconConfig } from '../../../data/config';
import Instruction from '../../../data/instruction';
import { IconString } from '../../../data/symbols/customIconSymbol';
import Autocomplete from '../../components/Autocomplete';

export interface IconConfigProps {
  instruction: Instruction;
  config: IconConfig;
  setConfig?: (field: string, value: IconConfig['default']) => void;
}

let iconNames: string[] = [];

// million-ignore
export default memo(function IconConfig({
  instruction,
  config,
  setConfig,
}: IconConfigProps) {
  const [iconList, setIconList] = useState<string[]>(iconNames);

  useEffect(() => {
    if (iconNames.length === 0) {
      import('react-icons/md')
        .then(md => {
          iconNames = Object.keys(md).filter(key => key !== 'default');
          setIconList(iconNames);
        })
        .catch(console.log);
    }
  }, []);

  const value = instruction[
    config.field as keyof typeof instruction
  ] as unknown as IconString;
  return (
    <div className="flex p-2 gap-4 justify-between items-center">
      <span>{config.description}</span>
      <Autocomplete
        className="grow"
        items={iconList}
        value={value}
        onChange={e => {
          setConfig?.(config.field, e);
        }}
      />
    </div>
  );
});

export const type = ConfigType.Icon;
