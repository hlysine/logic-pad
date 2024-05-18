import { memo } from 'react';
import { cn } from '../../utils';

export interface DifficultyProps {
  value: number;
  readonly?: boolean;
  onChange?: (value: number) => void;
  size?: 'xs' | 'sm' | 'md' | 'lg';
}

function sizeToRating(size: DifficultyProps['size']) {
  switch (size) {
    case 'xs':
      return 'rating-xs';
    case 'sm':
      return 'rating-sm';
    case 'lg':
      return 'rating-lg';
    default:
      return 'rating-md';
  }
}

export default memo(function Difficulty({
  value,
  readonly,
  onChange,
  size,
}: DifficultyProps) {
  readonly = readonly ?? !onChange;
  size = size ?? 'md';
  return (
    <div className={cn('rating', sizeToRating(size))}>
      {Array.from({ length: readonly ? 5 : 10 }, (_, i) => (
        <input
          key={i}
          type="radio"
          name="rating-8"
          className={cn(
            'mask mask-circle bg-accent scale-[0.8]',
            !readonly &&
              i >= 5 &&
              'mask-star-2 scale-105 relative -top-[0.1rem]',
            readonly &&
              value > 5 &&
              'mask-star-2 scale-105 relative -top-[0.1rem]',
            readonly && 'pointer-events-none',
            readonly && i > (value - 1) % 5 && 'opacity-0'
          )}
          checked={readonly ? (value - 1) % 5 === i : value === i + 1}
          onChange={() => !readonly && onChange?.(i + 1)}
        />
      ))}
    </div>
  );
});
