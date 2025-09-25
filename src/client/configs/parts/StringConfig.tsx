import { memo } from 'react';
import { ConfigType, StringConfig } from '@logic-pad/core/data/config';
import Configurable from '@logic-pad/core/data/configurable';
import ConfigItem from './ConfigItem';

export interface StringConfigProps {
  configurable: Configurable;
  config: StringConfig;
  setConfig?: (field: string, value: StringConfig['default']) => void;
}

// million-ignore
export default memo(function StringConfig({
  configurable,
  config,
  setConfig,
}: StringConfigProps) {
  const value = configurable[
    config.field as keyof typeof configurable
  ] as unknown as string;
  return (
    <ConfigItem config={config}>
      <textarea
        placeholder={config.placeholder}
        className="textarea min-w-0 grow"
        value={value}
        maxLength={config.maxLength}
        onChange={e => {
          setConfig?.(config.field, e.target.value);
        }}
      />
    </ConfigItem>
  );
});

export const type = ConfigType.String;
