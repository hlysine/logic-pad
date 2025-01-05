import { memo } from 'react';
import { ConfigType, ComparisonConfig } from '@logic-pad/core/data/config.js';
import Configurable from '@logic-pad/core/data/configurable.js';
import { COMPARISONS, Comparison } from '@logic-pad/core/data/primitives.js';

export interface ComparisonConfigProps {
  configurable: Configurable;
  config: ComparisonConfig;
  setConfig?: (field: string, value: ComparisonConfig['default']) => void;
}

function getDisplayName(comparison: Comparison) {
  switch (comparison) {
    case Comparison.Equal:
      return 'Equal';
    case Comparison.AtLeast:
      return 'At least';
    case Comparison.AtMost:
      return 'At most';
  }
}

// million-ignore
export default memo(function ComparisonConfig({
  configurable,
  config,
  setConfig,
}: ComparisonConfigProps) {
  const value = configurable[
    config.field as keyof typeof configurable
  ] as unknown as Comparison;
  return (
    <div className="flex p-2 gap-4 justify-between items-center">
      <span>{config.description}</span>
      <select
        className="select select-bordered w-36"
        value={value}
        onChange={e =>
          setConfig?.(config.field, e.currentTarget.value as Comparison)
        }
      >
        {COMPARISONS.map(c => (
          <option key={c} value={c}>
            {getDisplayName(c)}
          </option>
        ))}
      </select>
    </div>
  );
});

export const type = ConfigType.Comparison;
