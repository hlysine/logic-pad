import { memo } from 'react';
import { cn } from '../../client/uiHelper.ts';
import LotusSymbolData from '@logic-pad/core/data/symbols/lotusSymbol.js';
import { ORIENTATIONS } from '@logic-pad/core/data/primitives.js';
import { PiFlowerLotusThin } from 'react-icons/pi';

export interface LotusProps {
  textClass: string;
  symbol: LotusSymbolData;
}

export default memo(function LotusSymbol({ textClass, symbol }: LotusProps) {
  return (
    <div
      className={cn(
        'absolute flex justify-center items-center w-full h-full pointer-events-none',
        textClass
      )}
      style={{
        transform: `rotate(${45 * ORIENTATIONS.indexOf(symbol.orientation)}deg)`,
      }}
    >
      <div className="absolute w-0 h-[0.16em] border-[0.01em] border-current mx-auto top-[0.1em]"></div>
      <PiFlowerLotusThin className="absolute m-auto" size="0.6em" />
      <div className="absolute w-0 h-[0.2em] border-[0.01em] border-current mx-auto bottom-[0.1em]"></div>
    </div>
  );
});

export const id = 'lotus';
