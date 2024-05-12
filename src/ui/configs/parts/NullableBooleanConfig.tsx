import { memo } from 'react';
import { ConfigType, NullableBooleanConfig } from '../../../data/config';
import Configurable from '../../../data/configurable';
import { FaTrashCan } from 'react-icons/fa6';

export interface NullableBooleanConfigProps {
  configurable: Configurable;
  config: NullableBooleanConfig;
  setConfig?: (field: string, value: NullableBooleanConfig['default']) => void;
}

// million-ignore
export default memo(function BooleanConfig({
  configurable,
  config,
  setConfig,
}: NullableBooleanConfigProps) {
  const value = configurable[
    config.field as keyof typeof configurable
  ] as unknown as boolean | null;
  return (
    <div className="flex p-2 gap-4 justify-between items-center">
      <span>{config.description}</span>
      {value === null ? (
        <button
          className="btn btn-sm"
          onClick={() => {
            setConfig?.(config.field, config.default ?? false);
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
              className="btn btn-sm"
              onClick={() => {
                setConfig?.(config.field, null);
              }}
            >
              <FaTrashCan />
            </button>
          </div>
          <input
            type="checkbox"
            className="toggle"
            checked={value}
            min="0"
            step="1"
            onChange={e => {
              setConfig?.(config.field, e.target.checked);
            }}
          />
        </div>
      )}
    </div>
  );
});

export const type = ConfigType.NullableBoolean;
