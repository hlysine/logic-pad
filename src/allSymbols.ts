import NumberSymbolData from './data/symbols/numberSymbol';
import LetterSymbolData from './data/symbols/letterSymbol';
import ViewpointSymbolData from './data/symbols/viewpointSymbol';
import DartSymbolData from './data/symbols/dartSymbol';
import QuestionMarkSignData from './data/symbols/signs/questionMarkSign';
import SymbolData from './data/symbols/symbol';
import NumberSymbolUI from './ui/symbols/NumberSymbol';
import LetterSymbolUI from './ui/symbols/LetterSymbol';
import ViewpointSymbolUI from './ui/symbols/ViewpointSymbol';
import DartSymbolUI from './ui/symbols/DartSymbol';
import QuestionMarkSignUI from './ui/symbols/signs/QuestionMarkSign';

export interface SymbolProps<T extends SymbolData> {
  textClass: string;
  symbol: T;
}

interface SymbolInfo {
  readonly component: React.NamedExoticComponent<SymbolProps<SymbolData>>;
  readonly prototype: SymbolData;
}

const allSymbols = new Map<string, SymbolInfo>();

function register<T extends SymbolData>(
  prototype: T,
  component: React.NamedExoticComponent<SymbolProps<T>>
) {
  allSymbols.set(prototype.id, {
    component: component as React.NamedExoticComponent<SymbolProps<SymbolData>>,
    prototype,
  });
}

register(new NumberSymbolData(0, 0, 1), NumberSymbolUI);
register(new LetterSymbolData(0, 0, 'A'), LetterSymbolUI);
register(new ViewpointSymbolData(0, 0, 1), ViewpointSymbolUI);
register(new DartSymbolData(0, 0, 1), DartSymbolUI);
register(new QuestionMarkSignData(0, 0), QuestionMarkSignUI);

export default allSymbols;
