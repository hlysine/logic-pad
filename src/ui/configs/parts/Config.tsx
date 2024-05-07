import { memo } from 'react';
import { AnyConfig } from '../../../data/config';
import { allConfigs, ConfigProps } from '.';

export default memo(function Config({
  instruction,
  config,
  setConfig,
}: ConfigProps<AnyConfig>) {
  const Component = allConfigs.get(config.type);
  if (!Component) {
    throw new Error(`No component for symbol: ${config.type}`);
  }
  return (
    <Component
      instruction={instruction}
      config={config}
      setConfig={setConfig}
    />
  );
});
