import { memo } from 'react';
import { cn } from '../../utils';
import LotusSymbolData from '../../data/symbols/lotusSymbol';
import { ORIENTATIONS } from '../../data/primitives.ts';
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
    >
      <span className={cn('absolute m-auto text-[0.75em]', textClass)}>
        <PiFlowerLotusThin
          style={{
            transform: `rotate(${45 * ORIENTATIONS.indexOf(symbol.orientation)}deg)`,
          }}
        />
      </span>
    </div>
  );
});
