import SymbolData from '../../data/symbols/symbol';
import NumberSymbol from './NumberSymbol';
import LetterSymbol from './LetterSymbol';
import { useMemo } from 'react';

export interface SymbolProps<T extends SymbolData> {
  size: number;
  textClass: string;
  symbol: T;
}

const registry = new Map<string, (props: SymbolProps<any>) => JSX.Element>();
registry.set('number', NumberSymbol);
registry.set('letter', LetterSymbol);

export default function Symbol({
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
  const Component = registry.get(symbol.id);
  if (!Component) {
    throw new Error(`No component for symbol: ${symbol.id}`);
  }
  return (
    <div className="absolute" style={containerStyle}>
      <Component size={size} textClass={textClass} symbol={symbol} />
    </div>
  );
}
