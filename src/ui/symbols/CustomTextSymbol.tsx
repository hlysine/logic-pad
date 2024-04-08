import { memo } from 'react';
import { cn } from '../../utils';
import CustomTextSymbolData from '../../data/symbols/customTextSymbol';

export interface LetterProps {
  textClass: string;
  symbol: CustomTextSymbolData;
}

export default memo(function CustomTextSymbol({
  textClass,
  symbol,
}: LetterProps) {
  return (
    <div
      className={cn(
        'absolute flex justify-center items-center w-full h-full pointer-events-none',
        textClass
      )}
    >
      <span className={cn('absolute m-auto text-[0.75em]', textClass)}>
        {symbol.text}
      </span>
    </div>
  );
});
