import { memo } from 'react';
import { cn } from '../uiHelper.ts';
import EveryLetterSymbolData from '@logic-pad/core/data/symbols/everyLetterSymbol';

export interface EveryLetterProps {
  textClass: string;
  symbol: EveryLetterSymbolData;
}

export default memo(function EveryLetterSymbol({
  textClass,
  symbol,
}: EveryLetterProps) {
  return (
    <div
      className={cn(
        'absolute flex justify-center items-center w-full h-full pointer-events-none',
        textClass
      )}
    >
      <span
        className={cn(
          'absolute m-auto text-[0.75em] x-text-outline',
          textClass
        )}
        aria-hidden="true"
      >
        {symbol.letter}
      </span>
      <span className="sr-only">
        {`Hollow Letter ${symbol.letter} at (${symbol.x}, ${symbol.y})`}
      </span>
    </div>
  );
});

export const id = 'every_letter';
