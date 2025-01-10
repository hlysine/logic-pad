import { memo } from 'react';
import { DirectionToggleConfig, ConfigType } from '@logic-pad/core/data/config';
import Configurable from '@logic-pad/core/data/configurable';
import { Direction, DirectionToggle } from '@logic-pad/core/data/primitives';
import { cn } from '../../../client/uiHelper.ts';
import { FaArrowUp } from 'react-icons/fa';
import { directionToRotation } from '@logic-pad/core/data/dataHelper';

export interface DirectionToggleConfigProps {
  configurable: Configurable;
  config: DirectionToggleConfig;
  setConfig?: (field: string, value: DirectionToggleConfig['default']) => void;
}

// million-ignore
const DirectionToggleRadio = memo(function DirectionToggleRadio({
  checked,
  setChecked,
  direction,
  className,
}: {
  checked: boolean;
  setChecked: (value: boolean) => void;
  direction: Direction;
  className?: string;
}) {
  return (
    <div className={cn('relative w-8 h-8', className)}>
      <input
        type="checkbox"
        name="radio-direction-toggle"
        className="absolute inset-0 appearance-none rounded checked:shadow-glow-md checked:shadow-accent checked:border-2 checked:border-accent"
        checked={checked}
        onChange={e => {
          setChecked(e.target.checked);
        }}
      />
      <FaArrowUp
        className="absolute inset-0 m-auto pointer-events-none"
        style={{
          transform: `rotate(${directionToRotation(direction)}deg)`,
        }}
      />
    </div>
  );
});

// million-ignore
export default memo(function DirectionToggleConfig({
  configurable,
  config,
  setConfig,
}: DirectionToggleConfigProps) {
  const value = configurable[
    config.field as keyof typeof configurable
  ] as unknown as DirectionToggle;
  return (
    <div className="flex p-2 justify-between items-center">
      <span>{config.description}</span>
      <div className="grid grid-cols-3 grid-rows-3">
        <DirectionToggleRadio
          checked={value.up}
          setChecked={val => setConfig?.(config.field, { ...value, up: val })}
          direction={Direction.Up}
          className="col-start-2 row-start-1"
        />
        <DirectionToggleRadio
          checked={value.left}
          setChecked={val => setConfig?.(config.field, { ...value, left: val })}
          direction={Direction.Left}
          className="col-start-1 row-start-2"
        />
        <DirectionToggleRadio
          checked={value.right}
          setChecked={val =>
            setConfig?.(config.field, { ...value, right: val })
          }
          direction={Direction.Right}
          className="col-start-3 row-start-2"
        />
        <DirectionToggleRadio
          checked={value.down}
          setChecked={val => setConfig?.(config.field, { ...value, down: val })}
          direction={Direction.Down}
          className="col-start-2 row-start-3"
        />
      </div>
    </div>
  );
});

export const type = ConfigType.DirectionToggle;
