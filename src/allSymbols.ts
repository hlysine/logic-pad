import NumberSymbolData from './data/symbols/numberSymbol';
import LetterSymbolData from './data/symbols/letterSymbol';
import ViewpointSymbolData from './data/symbols/viewpointSymbol';
import QuestionMarkSignData from './data/symbols/signs/questionMarkSign';
import SymbolData from './data/symbols/symbol';
import NumberSymbolUI from './ui/symbols/NumberSymbol';
import LetterSymbolUI from './ui/symbols/LetterSymbol';
import ViewpointSymbolUI from './ui/symbols/ViewpointSymbol';
import QuestionMarkSignUI from './ui/symbols/signs/QuestionMarkSign';

export interface SymbolProps<T extends SymbolData> {
  size: number;
  textClass: string;
  symbol: T;
}

type SymbolConstructor<T extends SymbolData> = (new (...args: any[]) => T) & {
  readonly id: string;
};

const allSymbols = new Map<
  string,
  React.NamedExoticComponent<SymbolProps<any>>
>();

function registerSymbol<T extends SymbolData>(
  constructor: SymbolConstructor<T>,
  component: React.NamedExoticComponent<SymbolProps<T>>
) {
  allSymbols.set(constructor.id, component);
}

registerSymbol(NumberSymbolData, NumberSymbolUI);
registerSymbol(LetterSymbolData, LetterSymbolUI);
registerSymbol(ViewpointSymbolData, ViewpointSymbolUI);
registerSymbol(QuestionMarkSignData, QuestionMarkSignUI);

export default allSymbols;
