import { memo } from 'react';
import { ConfigType, NullableNoteConfig } from '@logic-pad/core/data/config';
import Configurable from '@logic-pad/core/data/configurable';
import Autocomplete from '../../components/Autocomplete';
import { FaTrashCan } from 'react-icons/fa6';

export interface NullableNoteConfigProps {
  configurable: Configurable;
  config: NullableNoteConfig;
  setConfig?: (field: string, value: NullableNoteConfig['default']) => void;
}

const letters = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
const accidentals = ['bb', 'b', '', '#', 'x'];
const octaves = [-4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
const noteNames: string[] = [];
letters.forEach(letter => {
  accidentals.forEach(accidental => {
    octaves.forEach(octave => {
      noteNames.push(`${letter}${accidental}${octave}`);
    });
  });
});

// million-ignore
export default memo(function NullableNoteConfig({
  configurable,
  config,
  setConfig,
}: NullableNoteConfigProps) {
  const value = configurable[
    config.field as keyof typeof configurable
  ] as unknown as string | null;
  return (
    <div className="flex p-2 gap-4 justify-between items-center">
      <span>{config.description}</span>
      {value === null ? (
        <button
          type="button"
          className="btn btn-sm"
          onClick={() => {
            setConfig?.(config.field, config.default ?? 'C4');
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
          <Autocomplete
            className="grow"
            items={noteNames}
            value={value}
            onChange={e => {
              setConfig?.(config.field, e);
            }}
          />
        </div>
      )}
    </div>
  );
});

export const type = ConfigType.NullableNote;
