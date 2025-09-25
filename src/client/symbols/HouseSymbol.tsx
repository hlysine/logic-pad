import { memo } from 'react';
import { cn } from '../uiHelper.ts';
import HouseSymbolData from '@logic-pad/core/data/symbols/houseSymbol';
import { BsHouse } from 'react-icons/bs';

export interface HouseProps {
  textClass: string;
  symbol: HouseSymbolData;
}

export default memo(function HouseSymbol({ textClass, symbol }: HouseProps) {
  return (
    <div
      className={cn(
        'absolute flex justify-center items-center w-full h-full pointer-events-none',
        textClass
      )}
    >
      <span className={cn('absolute m-auto text-[0.75em]', textClass)}>
        <BsHouse />
      </span>
      <span
        className={cn(
          'absolute m-auto text-[0.4em] translate-y-[0.15em]',
          textClass
        )}
      >
        {symbol.number}
      </span>
    </div>
  );
});

export const id = 'house';
