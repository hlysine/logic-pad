import { memo } from 'react';
import { OrientationConfig, ConfigType } from '../../../data/config';
import Instruction from '../../../data/instruction';
import { Orientation } from '../../../data/primitives';
import { cn } from '../../../utils';
import { FaArrowUp } from 'react-icons/fa';
import { orientationToRotation } from '../../../data/helper';

export interface OrientationConfigProps {
  instruction: Instruction;
  config: OrientationConfig;
  setConfig?: (field: string, value: OrientationConfig['default']) => void;
}

// million-ignore
const OrientationRadio = memo(function OrientationRadio({
  value,
  setValue,
  orientation,
  className,
}: {
  value: Orientation;
  setValue: (value: Orientation) => void;
  orientation: Orientation;
  className?: string;
}) {
  return (
    <div className={cn('relative w-8 h-8', className)}>
      <input
        type="radio"
        name="radio-orientation"
        className="absolute inset-0 appearance-none rounded checked:shadow-glow-md checked:shadow-accent checked:border-2 checked:border-accent"
        value={orientation}
        checked={value === orientation}
        onChange={e => {
          setValue(e.target.value as Orientation);
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
export default memo(function OrientationConfig({
  instruction,
  config,
  setConfig,
}: OrientationConfigProps) {
  const value = instruction[
    config.field as keyof typeof instruction
  ] as Orientation;
  return (
    <div className="flex p-2 justify-between items-center">
      <span>{config.description}</span>
      <div className="grid grid-cols-3 grid-rows-3">
        <OrientationRadio
          value={value}
          setValue={value => setConfig?.(config.field, value)}
          orientation={Orientation.Up}
          className="col-start-2 row-start-1"
        />
        <OrientationRadio
          value={value}
          setValue={value => setConfig?.(config.field, value)}
          orientation={Orientation.Left}
          className="col-start-1 row-start-2"
        />
        <OrientationRadio
          value={value}
          setValue={value => setConfig?.(config.field, value)}
          orientation={Orientation.Right}
          className="col-start-3 row-start-2"
        />
        <OrientationRadio
          value={value}
          setValue={value => setConfig?.(config.field, value)}
          orientation={Orientation.Down}
          className="col-start-2 row-start-3"
        />
        <OrientationRadio
          value={value}
          setValue={value => setConfig?.(config.field, value)}
          orientation={Orientation.DownLeft}
          className="col-start-1 row-start-3"
        />
        <OrientationRadio
          value={value}
          setValue={value => setConfig?.(config.field, value)}
          orientation={Orientation.DownRight}
          className="col-start-3 row-start-3"
        />
        <OrientationRadio
          value={value}
          setValue={value => setConfig?.(config.field, value)}
          orientation={Orientation.UpLeft}
          className="col-start-1 row-start-1"
        />
        <OrientationRadio
          value={value}
          setValue={value => setConfig?.(config.field, value)}
          orientation={Orientation.UpRight}
          className="col-start-3 row-start-1"
        />
      </div>
    </div>
  );
});

export const type = ConfigType.Orientation;
