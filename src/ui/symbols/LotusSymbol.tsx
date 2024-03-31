import { memo } from 'react';
import { cn } from '../../utils';
import LotusSymbolData from '../../data/symbols/lotusSymbol';

export interface LotusProps {
  textClass: string;
  symbol: LotusSymbolData;
}

export default memo(function LotusSymbol({ textClass }: LotusProps) {
  return (
    <div
      className={cn(
        'absolute flex justify-center items-center w-full h-full pointer-events-none',
        textClass
      )}
    >
      <span className={cn('absolute m-auto text-[0.75em]', textClass)}>
        {"L"}
      </span>
    </div>
  );
});
