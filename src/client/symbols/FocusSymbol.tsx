import { memo } from 'react';
import { cn } from '../uiHelper.ts';
import FocusSymbolData from '@logic-pad/core/data/symbols/focusSymbol';
import {
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
  FiChevronUp,
} from 'react-icons/fi';

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
      <div className="absolute top-[0.05em] right-[0.05em] rotate-45">
        <FiChevronDown size={'0.4em'} />
      </div>
      <div className="absolute top-[0.05em] left-[0.05em] rotate-45">
        <FiChevronRight size={'0.4em'} />
      </div>
      <div className="absolute bottom-[0.05em] right-[0.05em] rotate-45">
        <FiChevronLeft size={'0.4em'} />
      </div>
      <div className="absolute bottom-[0.05em] left-[0.05em] rotate-45">
        <FiChevronUp size={'0.4em'} />
      </div>
    </div>
  );
});

export const id = 'focus';
