import { memo, useId } from 'react';
import { cn } from '../../client/uiHelper.ts';
import { BsQuestionCircleFill } from 'react-icons/bs';

export interface DifficultyProps {
  value: number;
  readonly?: boolean;
  onChange?: (value: number) => void;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
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
  className,
}: DifficultyProps) {
  const radioId = useId();
  readonly = readonly ?? !onChange;
  size = size ?? 'md';
  if (readonly && value === 0) {
    return (
      <div
        className={cn(
          'rating',
          sizeToRating(size),
          'tooltip tooltip-info w-fit tooltip-right',
          className
        )}
        data-tip="Unrated"
      >
        <BsQuestionCircleFill
          size={18}
          aria-hidden="true"
          className="text-neutral-content bg-transparent"
        />
      </div>
    );
  }
  return (
    <div
      className={cn(
        'rating',
        sizeToRating(size),
        className,
        'flex items-center'
      )}
      role="radiogroup"
      aria-label={readonly ? `Difficulty rating: ${value}` : undefined}
    >
      {[
        <input
          key={-1}
          type="radio"
          name={`difficulty-rating-${radioId}`}
          aria-hidden={readonly ? 'true' : undefined}
          aria-label="Remove rating"
          className="rating-hidden pointer-events-none hidden"
          checked={value === 0}
          readOnly={true}
        />,
        ...Array.from({ length: readonly ? 5 : 10 }, (_, i) => (
          <input
            key={i}
            type="radio"
            aria-hidden={readonly ? 'true' : undefined}
            aria-label={`Rate difficulty ${i + 1 + (readonly && value > 5 ? 5 : 0)}`}
            name={`difficulty-rating-${radioId}`}
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
        )),
      ]}
    </div>
  );
});
