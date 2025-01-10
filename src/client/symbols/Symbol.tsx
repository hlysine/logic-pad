import { allSymbols, SymbolProps } from '.';
import SymbolData from '@logic-pad/core/data/symbols/symbol';
import { memo, useMemo } from 'react';

export default memo(function Symbol({
  textClass,
  symbol,
}: SymbolProps<SymbolData>) {
  const containerStyle = useMemo(
    () => ({
      top: `calc(${symbol.y} * 1em)`,
      left: `calc(${symbol.x} * 1em)`,
    }),
    [symbol.x, symbol.y]
  );
  const Component = allSymbols.get(symbol.id)?.component;
  if (!Component) {
    throw new Error(`No component for symbol: ${symbol.id}`);
  }
  return (
    <div className="absolute w-[1em] h-[1em] logic-tile" style={containerStyle}>
      <Component textClass={textClass} symbol={symbol} />
    </div>
  );
});
