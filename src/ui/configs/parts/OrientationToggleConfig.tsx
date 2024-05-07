import { memo } from 'react';
import { OrientationToggleConfig, ConfigType } from '../../../data/config';
import Instruction from '../../../data/instruction';
import { Orientation, OrientationToggle } from '../../../data/primitives';
import { cn } from '../../../utils';
import { FaArrowUp } from 'react-icons/fa';
import { orientationToRotation } from '../../../data/helper';

export interface OrientationToggleConfigProps {
  instruction: Instruction;
  config: OrientationToggleConfig;
  setConfig?: (
    field: string,
    value: OrientationToggleConfig['default']
  ) => void;
}

// million-ignore
const OrientationToggleRadio = memo(function OrientationToggleRadio({
  checked,
  setChecked,
  orientation,
  className,
}: {
  checked: boolean;
  setChecked: (value: boolean) => void;
  orientation: Orientation;
  className?: string;
}) {
  return (
    <div className={cn('relative w-8 h-8', className)}>
      <input
        type="checkbox"
        name="radio-orientation-toggle"
        className="absolute inset-0 appearance-none rounded checked:shadow-glow-md checked:shadow-accent checked:border-2 checked:border-accent"
        checked={checked}
        onChange={e => {
          setChecked(e.target.checked);
        }}
      />
      <FaArrowUp
        className="absolute inset-0 m-auto pointer-events-none"
        style={{
          transform: `rotate(${orientationToRotation(orientation)}deg)`,
        }}
      />
    </div>
  );
});

// million-ignore
export default memo(function OrientationToggleConfig({
  instruction,
  config,
  setConfig,
}: OrientationToggleConfigProps) {
  const value = instruction[
    config.field as keyof typeof instruction
  ] as unknown as OrientationToggle;
  return (
    <div className="flex p-2 justify-between items-center">
      <span>{config.description}</span>
      <div className="grid grid-cols-3 grid-rows-3">
        <OrientationToggleRadio
          checked={value.up}
          setChecked={val => setConfig?.(config.field, { ...value, up: val })}
          orientation={Orientation.Up}
          className="col-start-2 row-start-1"
        />
        <OrientationToggleRadio
          checked={value.left}
          setChecked={val => setConfig?.(config.field, { ...value, left: val })}
          orientation={Orientation.Left}
          className="col-start-1 row-start-2"
        />
        <OrientationToggleRadio
          checked={value.right}
          setChecked={val =>
            setConfig?.(config.field, { ...value, right: val })
          }
          orientation={Orientation.Right}
          className="col-start-3 row-start-2"
        />
        <OrientationToggleRadio
          checked={value.down}
          setChecked={val => setConfig?.(config.field, { ...value, down: val })}
          orientation={Orientation.Down}
          className="col-start-2 row-start-3"
        />
        <OrientationToggleRadio
          checked={value[Orientation.UpLeft]}
          setChecked={val =>
            setConfig?.(config.field, { ...value, [Orientation.UpLeft]: val })
          }
          orientation={Orientation.UpLeft}
          className="col-start-1 row-start-1"
        />
        <OrientationToggleRadio
          checked={value[Orientation.UpRight]}
          setChecked={val =>
            setConfig?.(config.field, { ...value, [Orientation.UpRight]: val })
          }
          orientation={Orientation.UpRight}
          className="col-start-3 row-start-1"
        />
        <OrientationToggleRadio
          checked={value[Orientation.DownLeft]}
          setChecked={val =>
            setConfig?.(config.field, { ...value, [Orientation.DownLeft]: val })
          }
          orientation={Orientation.DownLeft}
          className="col-start-1 row-start-3"
        />
        <OrientationToggleRadio
          checked={value[Orientation.DownRight]}
          setChecked={val =>
            setConfig?.(config.field, {
              ...value,
              [Orientation.DownRight]: val,
            })
          }
          orientation={Orientation.DownRight}
          className="col-start-3 row-start-3"
        />
      </div>
    </div>
  );
});

export const type = ConfigType.OrientationToggle;
