import { useMemo } from 'react';
import { cn } from '../../utils';
import LetterSymbolData from '../../data/symbols/letterSymbol';

export interface LetterProps {
  size: number;
  textClass: string;
  symbol: LetterSymbolData;
}

export default function LetterSymbol({ size, textClass, symbol }: LetterProps) {
  const textStyle = useMemo<React.CSSProperties>(
    () => ({
      fontSize: `${size * 0.75}px`,
    }),
    [size]
  );
  return (
    <div
      className={cn(
        'absolute flex justify-center items-center w-full h-full pointer-events-none',
        textClass
      )}
    >
      <span className={cn('absolute m-auto', textClass)} style={textStyle}>
        {symbol.letter}
      </span>
    </div>
  );
}
