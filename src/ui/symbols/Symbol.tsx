import allSymbols, { SymbolProps } from '../../allSymbols';
import SymbolData from '../../data/symbols/symbol';
import { memo, useMemo } from 'react';

export default memo(function Symbol({
  size,
  textClass,
  symbol,
}: SymbolProps<SymbolData>) {
  const containerStyle = useMemo(
    () => ({
      width: `${size}px`,
      height: `${size}px`,
      top: `${symbol.y * size}px`,
      left: `${symbol.x * size}px`,
    }),
    [size, symbol.x, symbol.y]
  );
  const Component = allSymbols.get(symbol.id);
  if (!Component) {
    throw new Error(`No component for symbol: ${symbol.id}`);
  }
  return (
    <div className="absolute" style={containerStyle}>
      <Component size={size} textClass={textClass} symbol={symbol} />
    </div>
  );
});
