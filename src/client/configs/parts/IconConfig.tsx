import { memo, useEffect, useState } from 'react';
import { ConfigType, IconConfig } from '@logic-pad/core/data/config';
import Configurable from '@logic-pad/core/data/configurable';
import Autocomplete from '../../components/Autocomplete';
import ConfigItem from './ConfigItem';

export interface IconConfigProps {
  configurable: Configurable;
  config: IconConfig;
  setConfig?: (field: string, value: IconConfig['default']) => void;
}

let iconNames: string[] = [];

// million-ignore
export default memo(function IconConfig({
  configurable,
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

  const value = configurable[
    config.field as keyof typeof configurable
  ] as unknown as string;
  return (
    <ConfigItem config={config}>
      <Autocomplete
        className="grow"
        items={iconList}
        value={value}
        onChange={e => {
          setConfig?.(config.field, e);
        }}
      />
    </ConfigItem>
  );
});

export const type = ConfigType.Icon;
