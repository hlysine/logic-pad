import { memo, useMemo } from 'react';
import { cn } from '../../client/uiHelper.ts';
import CustomTextSymbolData from '../../data/symbols/customTextSymbol';

export interface CustomTextProps {
  textClass: string;
  symbol: CustomTextSymbolData;
}

function getTextSize(text: string) {
  if (text.length === 1) return 'text-[0.75em]';
  if (text.length === 2 && !text.includes('\n')) return 'text-[0.5em]';
  if (text.length === 3 && !text.includes('\n')) return 'text-[0.4em]';
  return 'text-[0.3em]';
}

export default memo(function CustomTextSymbol({
  textClass,
  symbol,
}: CustomTextProps) {
  const textStyle = useMemo(
    () => ({
      transform: `rotate(${symbol.rotation}deg)`,
    }),
    [symbol.rotation]
  );
  return (
    <div
      className={cn(
        'absolute flex justify-center items-center w-full h-full pointer-events-none',
        textClass
      )}
    >
      <pre
        className={cn(
          'absolute m-auto font-[inherit] text-center',
          getTextSize(symbol.text),
          textClass
        )}
        style={textStyle}
      >
        {symbol.text}
      </pre>
    </div>
  );
});

export const id = 'custom_text';
