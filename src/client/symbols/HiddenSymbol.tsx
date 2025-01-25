import { memo } from 'react';
import { cn } from '../uiHelper';
import HiddenSymbolData from '@logic-pad/core/data/symbols/hiddenSymbol';
import { MdHideSource } from 'react-icons/md';

export interface LetterProps {
  textClass: string;
  symbol: HiddenSymbolData;
}

export default memo(function LetterSymbol({ textClass }: LetterProps) {
  return (
    <div
      className={cn(
        'absolute flex justify-center items-center w-full h-full pointer-events-none opacity-30',
        textClass
      )}
    >
      <span className={cn('absolute m-auto text-[0.75em]', textClass)}>
        <MdHideSource />
      </span>
    </div>
  );
});

export const id = 'hidden';
