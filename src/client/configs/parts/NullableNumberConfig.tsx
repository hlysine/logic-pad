import { memo } from 'react';
import { ConfigType, NullableNumberConfig } from '@logic-pad/core/data/config';
import Configurable from '@logic-pad/core/data/configurable';
import { FaTrashCan } from 'react-icons/fa6';

export interface NullableNumberConfigProps {
  configurable: Configurable;
  config: NullableNumberConfig;
  setConfig?: (field: string, value: NullableNumberConfig['default']) => void;
}

// million-ignore
export default memo(function NullableNumberConfig({
  configurable,
  config,
  setConfig,
}: NullableNumberConfigProps) {
  const value = configurable[
    config.field as keyof typeof configurable
  ] as unknown as number | null;
  return (
    <div className="flex p-2 gap-4 justify-between items-center">
      <span>{config.description}</span>
      {value === null ? (
        <button
          type="button"
          className="btn btn-sm"
          onClick={() => {
            setConfig?.(
              config.field,
              config.default ?? config.min ?? config.max ?? 0
            );
          }}
        >
          Unset
        </button>
      ) : (
        <div className="flex gap-2 items-center">
          <div
            className="tooltip tooltip-info tooltip-top"
            data-tip="Clear value"
          >
            <button
              type="button"
              aria-label="Clear value"
              className="btn btn-sm"
              onClick={() => {
                setConfig?.(config.field, null);
              }}
            >
              <FaTrashCan />
            </button>
          </div>
          <input
            type="number"
            className="input min-w-0 grow"
            value={value}
            min={config.min}
            max={config.max}
            step={config.step ?? 1}
            onChange={e => {
              if (config.step === 1)
                setConfig?.(config.field, Math.floor(Number(e.target.value)));
              else setConfig?.(config.field, Number(e.target.value));
            }}
          />
        </div>
      )}
    </div>
  );
});

export const type = ConfigType.NullableNumber;
