import { memo } from 'react';
import { AnyConfig } from '@logic-pad/core/data/config';
import { allConfigs, ConfigProps } from '.';

export default memo(function Config({
  configurable,
  config,
  setConfig,
}: ConfigProps<AnyConfig>) {
  const Component = allConfigs.get(config.type);
  if (!Component) {
    throw new Error(`No component for symbol: ${config.type}`);
  }
  return (
    <Component
      configurable={configurable}
      config={config}
      setConfig={setConfig}
    />
  );
});
