import { memo } from 'react';
import { cn } from '../../client/uiHelper.ts';
import LetterSymbolData from '@logic-pad/core/data/symbols/letterSymbol';

export interface LetterProps {
  textClass: string;
  symbol: LetterSymbolData;
}

export default memo(function LetterSymbol({ textClass, symbol }: LetterProps) {
  return (
    <div
      className={cn(
        'absolute flex justify-center items-center w-full h-full pointer-events-none',
        textClass
      )}
    >
      <span
        className={cn('absolute m-auto text-[0.75em]', textClass)}
        aria-hidden="true"
      >
        {symbol.letter}
      </span>
      <span className="sr-only">
        {`Letter ${symbol.letter} at (${symbol.x}, ${symbol.y})`}
      </span>
    </div>
  );
});

export const id = 'letter';
