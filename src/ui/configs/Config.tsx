import { memo } from 'react';
import { AnyConfig, ConfigType } from '../../data/config';
import ColorConfig from './ColorConfig';
import Instruction from '../../data/instruction';
import GridConfig from './GridConfig';
import StringConfig from './StringConfig';

export interface ConfigProps<T extends AnyConfig> {
  instruction: Instruction;
  config: T;
  setConfig?: (field: string, value: T['default']) => void;
}

const registry = new Map<
  string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  React.NamedExoticComponent<ConfigProps<any>>
>();
registry.set(ConfigType.Color, ColorConfig);
registry.set(ConfigType.Grid, GridConfig);
registry.set(ConfigType.String, StringConfig);

export default memo(function Config({
  instruction,
  config,
  setConfig,
}: ConfigProps<AnyConfig>) {
  const Component = registry.get(config.type);
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
