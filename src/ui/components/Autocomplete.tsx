import { memo, useMemo } from 'react';
import fuzzysort from 'fuzzysort';
import { cn } from '../../utils';
import AnnotatedText from './AnnotatedText';

export interface AutocompleteProps {
  items: string[];
  value: string;
  placeholder?: string;
  onChange?: (value: string) => void;
  onConfirm?: (value: string) => void;
  className?: string;
}

// million-ignore
export default memo(function Autocomplete({
  items,
  value,
  placeholder,
  onChange,
  onConfirm,
  className,
}: AutocompleteProps) {
  const results = useMemo(
    () => fuzzysort.go(value, items, { limit: 10 }),
    [value, items]
  );

  const confirm = (value: string) => {
    onChange?.(value);
    onConfirm?.(value);
  };

  return (
    <div className={cn('shrink-0', className)}>
      <div className="dropdown dropdown-end w-full">
        <input
          type="text"
          tabIndex={0}
          placeholder={placeholder}
          className="input w-full max-w-xs"
          value={value}
          onChange={e => onChange?.(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              const result = results[0]?.target;
              if (result) confirm(result);
            } else if (e.key === 'Escape') {
              onChange?.('');
            }
          }}
        />
        <ul
          tabIndex={0}
          className={cn(
            'dropdown-content z-[1] menu p-2 shadow bg-base-100 text-base-content rounded-box w-full m-0',
            results.length === 0 && 'hidden'
          )}
        >
          {results.map(result => (
            <li key={result.target}>
              <a
                className="overflow-hidden"
                onClick={() => confirm(result.target)}
              >
                <AnnotatedText text={result.target} />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
});
