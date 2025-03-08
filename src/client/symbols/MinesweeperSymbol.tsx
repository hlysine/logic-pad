import { memo } from 'react';
import { cn } from '../../client/uiHelper.ts';
import MinesweeperSymbolData from '@logic-pad/core/data/symbols/minesweeperSymbol';
import {
  BsChevronCompactDown,
  BsChevronCompactUp,
  BsChevronCompactRight,
  BsChevronCompactLeft,
} from 'react-icons/bs';

export interface MinesweeperProps {
  textClass: string;
  symbol: MinesweeperSymbolData;
}

export default memo(function MinesweeperSymbol({
  textClass,
  symbol,
}: MinesweeperProps) {
  return (
    <div
      className={cn(
        'absolute flex justify-center items-center w-full h-full pointer-events-none',
        textClass
      )}
    >
      <span className={cn('absolute m-auto text-[0.6em]', textClass)}>
        {symbol.number}
      </span>
      <div className="absolute mx-auto top-0 mb-auto">
        <BsChevronCompactUp size={'0.3em'} />
      </div>
      <div className="absolute mx-auto bottom-0 mt-auto">
        <BsChevronCompactDown size={'0.3em'} />
      </div>
      <div className="absolute my-auto left-0 mr-auto">
        <BsChevronCompactLeft size={'0.3em'} />
      </div>
      <div className="absolute my-auto right-0 ml-auto">
        <BsChevronCompactRight size={'0.3em'} />
      </div>
      <div className="absolute flex justify-center items-center inset-0 rotate-45">
        <div className="absolute mx-auto top-0 mb-auto">
          <BsChevronCompactUp size={'0.3em'} />
        </div>
        <div className="absolute mx-auto bottom-0 mt-auto">
          <BsChevronCompactDown size={'0.3em'} />
        </div>
        <div className="absolute my-auto left-0 mr-auto">
          <BsChevronCompactLeft size={'0.3em'} />
        </div>
        <div className="absolute my-auto right-0 ml-auto">
          <BsChevronCompactRight size={'0.3em'} />
        </div>
      </div>
    </div>
  );
});

export const id = 'minesweeper';
