import { memo } from 'react';
import { cn } from '../../client/uiHelper.ts';
import DirectionLinkerSymbolData from '@logic-pad/core/data/symbols/directionLinkerSymbol';

export interface DirectionLinkerProps {
  textClass: string;
  symbol: DirectionLinkerSymbolData;
}

export default memo(function DirectionLinkerSymbol({
  textClass,
}: DirectionLinkerProps) {
  return (
    <div
      className={cn(
        'absolute flex justify-center items-center w-full h-full pointer-events-none',
        textClass
      )}
    >
      <span className={cn('absolute m-auto text-[0.75em]', textClass)}>
        {'D'}
      </span>
    </div>
  );
});
