import { memo } from 'react';
import { cn } from '../uiHelper.ts';
import FocusSymbolData from '@logic-pad/core/data/symbols/focusSymbol';
import {
  BsChevronCompactDown,
  BsChevronCompactLeft,
  BsChevronCompactRight,
  BsChevronCompactUp,
} from 'react-icons/bs';

export interface FocusProps {
  textClass: string;
  symbol: FocusSymbolData;
}

export default memo(function FocusSymbol({ textClass, symbol }: FocusProps) {
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
      <div className="absolute mx-auto top-0 mb-auto -m-[0.05em]">
        <BsChevronCompactDown size={'0.4em'} />
      </div>
      <div className="absolute mx-auto bottom-0 mt-auto -m-[0.05em]">
        <BsChevronCompactUp size={'0.4em'} />
      </div>
      <div className="absolute my-auto left-0 mr-auto -m-[0.05em]">
        <BsChevronCompactRight size={'0.4em'} />
      </div>
      <div className="absolute my-auto right-0 ml-auto -m-[0.05em]">
        <BsChevronCompactLeft size={'0.4em'} />
      </div>
    </div>
  );
});

export const id = 'focus';
