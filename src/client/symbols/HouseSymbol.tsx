import { memo } from 'react';
import { cn } from '../uiHelper.ts';
import HouseSymbolData from '@logic-pad/core/data/symbols/houseSymbol';
import { FaHouse } from 'react-icons/fa6';

export interface HouseProps {
  textClass: string;
  symbol: HouseSymbolData;
}

export default memo(function HouseSymbol({ textClass }: HouseProps) {
  return (
    <div
      className={cn(
        'absolute flex justify-center items-center w-full h-full pointer-events-none',
        textClass
      )}
    >
      <span className={cn('absolute m-auto text-[0.5em]', textClass)}>
        <FaHouse />
      </span>
    </div>
  );
});

export const id = 'house';
