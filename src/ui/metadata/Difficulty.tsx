import { memo } from 'react';
import { cn } from '../../utils';

export interface DifficultyProps {
  value: number;
  readonly?: boolean;
  onChange?: (value: number) => void;
}

export default memo(function Difficulty({
  value,
  readonly,
  onChange,
}: DifficultyProps) {
  readonly = readonly ?? !onChange;
  return (
    <div className="rating rating-md">
      {Array.from({ length: readonly ? 5 : 10 }, (_, i) => (
        <input
          key={i}
          type="radio"
          name="rating-8"
          className={cn(
            'mask mask-circle scale-75 bg-orange-400',
            !readonly && i >= 5 && 'mask-star-2 scale-105',
            readonly && value > 5 && 'mask-star-2 scale-105',
            readonly && 'pointer-events-none',
            readonly && i > (value - 1) % 5 && 'bg-gray-300',
          )}
          checked={readonly ? (value - 1) % 5 === i : value === i + 1}
          onChange={() => !readonly && onChange?.(i + 1)}
        />
      ))}
    </div>
  );
});
