import {memo} from 'react';
import {cn} from '../../utils';
import DartSymbolData from "../../data/symbols/dartSymbol.ts";
import {Direction} from "../../data/primitives.ts";
import {FiArrowDown, FiArrowLeft, FiArrowRight, FiArrowUp} from "react-icons/fi";

export interface DartProps {
  textClass: string;
  symbol: DartSymbolData;
}

export default memo(function DartSymbol({ textClass, symbol }: DartProps) {
  return [Direction.Up, Direction.Down].includes(symbol.orientation) ? (
    <div
      className={cn(
        'absolute flex justify-center items-center w-full h-full pointer-events-none',
        textClass
      )}
    >
        <span className={cn('absolute m-auto text-[0.6em]', textClass)}>
            {symbol.number}
        </span>
        <div className="absolute my-auto left-0 mr-auto -m-[0.05em]">
            {symbol.orientation === Direction.Up ? <FiArrowUp size={'0.4em'} /> : <FiArrowDown size={'0.4em'} />}
        </div>
    </div>
  ) : (
      <div
          className={cn(
              'absolute flex justify-center items-center w-full h-full pointer-events-none',
              textClass
          )}
      >
        <span className={cn('absolute m-auto text-[0.6em]', textClass)}>
            {symbol.number}
        </span>
        <div className="absolute mx-auto bottom-0 mt-auto -m-[0.05em]">
          {symbol.orientation === Direction.Left ? <FiArrowLeft size={'0.4em'} /> : <FiArrowRight size={'0.4em'} />}
        </div>
      </div>
  );
});
