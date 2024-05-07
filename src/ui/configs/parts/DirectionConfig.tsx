import { memo } from 'react';
import { DirectionConfig, ConfigType } from '../../../data/config';
import Instruction from '../../../data/instruction';
import { Direction } from '../../../data/primitives';
import { cn } from '../../../utils';
import { FaArrowUp } from 'react-icons/fa';
import { directionToRotation } from '../../../data/helper';

export interface DirectionConfigProps {
  instruction: Instruction;
  config: DirectionConfig;
  setConfig?: (field: string, value: DirectionConfig['default']) => void;
}

// million-ignore
const DirectionRadio = memo(function DirectionRadio({
  value,
  setValue,
  direction,
  className,
}: {
  value: Direction;
  setValue: (value: Direction) => void;
  direction: Direction;
  className?: string;
}) {
  return (
    <div className={cn('relative w-8 h-8', className)}>
      <input
        type="radio"
        name="radio-direction"
        className="absolute inset-0 appearance-none rounded checked:shadow-glow-md checked:shadow-accent checked:border-2 checked:border-accent"
        value={direction}
        checked={value === direction}
        onChange={e => {
          setValue(e.target.value as Direction);
        }}
      />
      <FaArrowUp
        className="absolute inset-0 m-auto pointer-events-none"
        style={{ transform: `rotate(${directionToRotation(direction)}deg)` }}
      />
    </div>
  );
});

// million-ignore
export default memo(function DirectionConfig({
  instruction,
  config,
  setConfig,
}: DirectionConfigProps) {
  const value = instruction[
    config.field as keyof typeof instruction
  ] as Direction;
  return (
    <div className="flex p-2 justify-between items-center">
      <span>{config.description}</span>
      <div className="grid grid-cols-3 grid-rows-3">
        <DirectionRadio
          value={value}
          setValue={value => setConfig?.(config.field, value)}
          direction={Direction.Up}
          className="col-start-2 row-start-1"
        />
        <DirectionRadio
          value={value}
          setValue={value => setConfig?.(config.field, value)}
          direction={Direction.Left}
          className="col-start-1 row-start-2"
        />
        <DirectionRadio
          value={value}
          setValue={value => setConfig?.(config.field, value)}
          direction={Direction.Right}
          className="col-start-3 row-start-2"
        />
        <DirectionRadio
          value={value}
          setValue={value => setConfig?.(config.field, value)}
          direction={Direction.Down}
          className="col-start-2 row-start-3"
        />
      </div>
    </div>
  );
});

export const type = ConfigType.Direction;
