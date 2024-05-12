import { memo } from 'react';
import { cn } from '../../utils';
import MinesweeperSymbolData from '../../data/symbols/minesweeperSymbol';

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
      <span
        className={cn(
          'absolute m-auto flex items-center justify-center border-current font-mono',
          textClass,
          symbol.number.toString().length === 1
            ? 'text-[0.65em] w-[1em] h-[1em] border-[0.07em] rounded-[0.1em]'
            : 'text-[0.52em] w-[1.25em] h-[1.25em] border-[0.0875em] rounded-[0.125em]'
        )}
      >
        {symbol.number}
      </span>
    </div>
  );
});

export const id = 'minesweeper';
