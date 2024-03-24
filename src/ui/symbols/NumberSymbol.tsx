import { memo } from 'react';
import { cn } from '../../utils';
import NumberSymbolData from '../../data/symbols/numberSymbol';

export interface NumberProps {
  textClass: string;
  symbol: NumberSymbolData;
}

export default memo(function NumberSymbol({ textClass, symbol }: NumberProps) {
  return (
    <div
      className={cn(
        'absolute flex justify-center items-center w-full h-full pointer-events-none',
        textClass
      )}
    >
      <span className={cn('absolute m-auto text-[0.75em]', textClass)}>
        {symbol.number}
      </span>
    </div>
  );
});
