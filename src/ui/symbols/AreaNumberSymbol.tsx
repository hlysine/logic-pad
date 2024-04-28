import { memo } from 'react';
import { cn } from '../../utils';
import AreaNumberSymbolData from '../../data/symbols/areaNumberSymbol';

export interface AreaNumberProps {
  textClass: string;
  symbol: AreaNumberSymbolData;
}

export default memo(function AreaNumberSymbol({
  textClass,
  symbol,
}: AreaNumberProps) {
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

export const id = 'number';
