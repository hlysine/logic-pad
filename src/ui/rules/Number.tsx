import { useMemo } from 'react';
import { cn } from '../../utils';
import NumberSymbol from '../../data/rules/number/numberSymbol';

export interface NumberProps {
  size: number;
  textClass: string;
  symbol: NumberSymbol;
}

export default function Number({ size, textClass, symbol }: NumberProps) {
  const textStyle = useMemo<React.CSSProperties>(
    () => ({
      fontSize: `${size * 0.75}px`,
    }),
    [size]
  );
  return (
    <div
      className={cn(
        'absolute flex justify-center items-center w-full h-full pointer-events-none',
        textClass
      )}
    >
      <span className={cn('absolute m-auto', textClass)} style={textStyle}>
        {symbol.number}
      </span>
    </div>
  );
}
