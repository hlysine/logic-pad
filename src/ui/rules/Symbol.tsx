import SymbolData from '../../data/rules/symbol';
import Number from './Number';

export interface SymbolProps<T extends SymbolData> {
  size: number;
  textClass: string;
  symbol: T;
}

const registry = new Map<string, (props: SymbolProps<any>) => JSX.Element>();
registry.set('number', Number);

export default function Symbol({
  size,
  textClass,
  symbol,
}: SymbolProps<SymbolData>) {
  const Component = registry.get(symbol.id);
  if (!Component) {
    throw new Error(`No component for symbol: ${symbol.id}`);
  }
  return <Component size={size} textClass={textClass} symbol={symbol} />;
}
