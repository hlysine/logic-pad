import { useMemo } from 'react';
import NumberMarkup from '../../data/markups/number';
import { cn } from '../../utils';

export interface NumberProps {
  size: number;
  textClass: string;
  markup: NumberMarkup;
}

export default function Number({ size, textClass, markup }: NumberProps) {
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
        {markup.number}
      </span>
    </div>
  );
}
